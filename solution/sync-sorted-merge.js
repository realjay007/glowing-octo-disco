"use strict";

const MinHeap = require("../lib/min-heap");

/**
 * Print all entries, across all of the sources, in chronological order.
 * @param {import("../lib/log-source")[]} logSources 
 * @param {import("../lib/printer")} printer 
 */
module.exports = (logSources, printer) => {
  /**
   * @type {MinHeap<{ log: { date: Date, msg: string }, sourceIndex: number }>}
   */
  const minHeap = new MinHeap();

  // Push the first log from each source into the heap
  logSources.forEach((logSource, index) => {
    const log = logSource.pop();
    if (log) {
      minHeap.push({ log, sourceIndex: index }, log.date.getTime());
    }
  });

  // Process heap and push the next log from the source of the popped log
  while(!minHeap.isEmpty()) {
    const { log, sourceIndex } = minHeap.pop();
    printer.print(log);

    const nextLog = logSources[sourceIndex].pop();
    if (nextLog) {
      minHeap.push({ log: nextLog, sourceIndex }, nextLog.date.getTime());
    }
  }

  console.log("Sync sort complete.");

  printer.done();
};
