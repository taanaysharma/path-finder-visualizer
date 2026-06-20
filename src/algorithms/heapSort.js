export function* heapSortGenerator(initialArray) {
  let array = [...initialArray];
  let n = array.length;

  yield {
    type: 'start', array: [...array], heapSize: n, i: null, j: null,
    explanation: 'Starting Heap Sort. First, build a max-heap from the input array.'
  };

  function* heapify(size, rootIndex) {
    let largest = rootIndex;
    let left = 2 * rootIndex + 1;
    let right = 2 * rootIndex + 2;

    yield {
      type: 'heapify_start', array: [...array], heapSize: size, i: rootIndex, j: null, left, right,
      explanation: `Heapifying subtree rooted at index ${rootIndex} (heap size ${size}).`
    };

    if (left < size) {
      yield {
        type: 'compare', array: [...array], heapSize: size, i: largest, j: left, left, right,
        explanation: `Comparing left child arr[${left}] (${array[left]}) with current largest arr[${largest}] (${array[largest]}).`
      };
      if (array[left] > array[largest]) largest = left;
    }

    if (right < size) {
      yield {
        type: 'compare', array: [...array], heapSize: size, i: largest, j: right, left, right,
        explanation: `Comparing right child arr[${right}] (${array[right]}) with current largest arr[${largest}] (${array[largest]}).`
      };
      if (array[right] > array[largest]) largest = right;
    }

    if (largest !== rootIndex) {
      [array[rootIndex], array[largest]] = [array[largest], array[rootIndex]];
      yield {
        type: 'swap', array: [...array], heapSize: size, i: rootIndex, j: largest, left, right,
        explanation: `Swapped arr[${rootIndex}] and arr[${largest}] to maintain max-heap property. Recursing into affected subtree.`
      };
      yield* heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  yield {
    type: 'heap_built', array: [...array], heapSize: n, i: null, j: null,
    explanation: 'Max-heap built. The largest element is now at the root (index 0).'
  };

  // Extract elements one by one
  for (let end = n - 1; end > 0; end--) {
    [array[0], array[end]] = [array[end], array[0]];
    yield {
      type: 'extract', array: [...array], heapSize: end, i: 0, j: end,
      explanation: `Moved max element (root) to index ${end}. That position is now locked into the sorted suffix.`
    };
    yield* heapify(end, 0);
  }

  yield { type: 'done', array: [...array], heapSize: 0, explanation: 'Heap Sort complete! The array is fully sorted.' };
}
