export function* insertionSortGenerator(initialArray) {
  let array = [...initialArray];
  let n = array.length;

  yield {
    type: 'start', array: [...array], i: null, j: null, key: null, sortedBoundary: 0,
    explanation: 'Starting Insertion Sort. The first element is treated as a sorted sub-array of size 1.'
  };

  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;

    yield {
      type: 'pick_key', array: [...array], i, j, key, sortedBoundary: i,
      explanation: `Picked key ${key} (index ${i}). Comparing backward into the sorted region [0..${i - 1}].`
    };

    while (j >= 0 && array[j] > key) {
      yield {
        type: 'compare', array: [...array], i, j, key, sortedBoundary: i,
        explanation: `Comparing ${array[j]} (index ${j}) with key ${key}. Since ${array[j]} > ${key}, shift it right.`
      };

      array[j + 1] = array[j];
      yield {
        type: 'shift', array: [...array], i, j: j + 1, key, sortedBoundary: i,
        explanation: `Shifted ${array[j]} from index ${j} to index ${j + 1}.`
      };
      j--;
    }

    array[j + 1] = key;
    yield {
      type: 'insert', array: [...array], i, j: j + 1, key, sortedBoundary: i + 1,
      explanation: `Inserted key ${key} at index ${j + 1}. Sorted region now covers [0..${i}].`
    };
  }

  yield { type: 'done', array: [...array], sortedBoundary: n, explanation: 'Insertion Sort complete! The array is fully sorted.' };
}
