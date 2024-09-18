"use strict";

const MinHeap = require("../lib/min-heap");

/**
 * @typedef {import("../lib/log-source")} LogSource
 * @typedef {import("../lib/printer")} Printer
 * @typedef {{ date: Date, msg: string }} Log
 */

/**
 * @implements {UnderlyingDefaultSource<Log>}
 */
class LogStreamSource {
  #logSource;

  /**
   * @param {LogSource} logSource
   */
  constructor(logSource) {
    this.#logSource = logSource;
  }

  /**
   * @param {ReadableStreamDefaultController<Log>} controller
   */
  async start(controller) {
    await this.pull(controller);
  }

  /**
   * @param {ReadableStreamDefaultController<Log>} controller
   */
  async pull(controller) {
    const log = await this.#logSource.popAsync();
    log ? controller.enqueue(log) : controller.close();
  }
}

/**
 * Print all entries, across all of the *async* sources, in chronological order.
 * @param {import("../lib/log-source")[]} logSources 
 * @param {import("../lib/printer")} printer 
 */
module.exports = async (logSources, printer) => {
  /**
   * Heap to store logs and sources in chronological order
   * @type {MinHeap<{ log: { date: Date, msg: string }, sourceIndex: number }>}
   */
  const minHeap = new MinHeap();

  const logReaders = logSources.map((logSource) => {
    return new ReadableStream(
      new LogStreamSource(logSource),
      { highWaterMark: 5 }, // Buffer up to 5 logs
    ).getReader();
  });

  // Push the first log from each source into the heap
  await Promise.all(logReaders.map(async (logReader, index) => {
    const { value, done } = await logReader.read();
    if (!done) {
      minHeap.push({ log: value, sourceIndex: index }, value.date.getTime());
    }
  }));


  // Process heap and push the next log from the source of the popped log
  while(!minHeap.isEmpty()) {
    const { log, sourceIndex } = minHeap.pop();
    printer.print(log);

    const { value, done } = await logReaders[sourceIndex].read();
    if (!done) {
      minHeap.push({ log: value, sourceIndex }, value.date.getTime());
    }
  }

  console.log("Async sort complete.")

  printer.done();
};
