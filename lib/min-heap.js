/**
 * MinHeap class to maintain a min heap
 * Each item in the heap is an object with a priority value
 * The item with the smallest priority value is at the top
 * @template T
 */
class MinHeap {
  /**
   * @type {Array<{ item: T, priority: number }>}
   */
	#heap = [];

	/**
   * Push item with priority into the heap
   * @param {number} item 
   * @param {number} priority 
   */
	push(item, priority) {
		this.#heap.push({ item, priority });
		this.#bubbleUp();
	}

	/**
   * Pop the item with the highest priority (smallest priority value)
   * @returns {T | null}
   */
	pop() {
		if (this.#heap.length === 0) return null;

		// Swap first and last items, then pop the last (min item)
		this.#swap(0, this.#heap.length - 1);
		const minItem = this.#heap.pop();

		this.#bubbleDown();
		return minItem.item;
	}

	/** Check if the heap is empty */
	isEmpty() {
		return this.#heap.length === 0;
	}

	/**
   * Bubble up the last element to maintain heap property
   */
	#bubbleUp() {
		let index = this.#heap.length - 1;
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);
			if (this.#heap[index].priority >= this.#heap[parentIndex].priority) break;
			this.#swap(index, parentIndex);
			index = parentIndex;
		}
	}

	/**
   * Bubble down the first element to maintain heap property
   */
	#bubbleDown() {
		let index = 0;
		const length = this.#heap.length;
		while (true) {
			const leftIndex = 2 * index + 1;
			const rightIndex = 2 * index + 2;
			let smallest = index;

			if (leftIndex < length && this.#heap[leftIndex].priority < this.#heap[smallest].priority) {
				smallest = leftIndex;
			}
			if (rightIndex < length && this.#heap[rightIndex].priority < this.#heap[smallest].priority) {
				smallest = rightIndex;
			}
			if (smallest === index) break;
			this.#swap(index, smallest);
			index = smallest;
		}
	}

	/** Swap two items in the heap */
	#swap(i, j) {
		[this.#heap[i], this.#heap[j]] = [this.#heap[j], this.#heap[i]];
	}
}

module.exports = MinHeap;
