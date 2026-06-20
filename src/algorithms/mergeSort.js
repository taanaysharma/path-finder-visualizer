export function* mergeSortGenerator(initialArray) {
  let array = [...initialArray];
  let callStack = [];

  function* merge(left, mid, right) {
    let n1 = mid - left + 1;
    let n2 = right - mid;
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = array[left + i];
    for (let j = 0; j < n2; j++) R[j] = array[mid + 1 + j];

    let i = 0, j = 0, k = left;

    yield { type: 'merge_start', array: [...array], left, mid, right, callStack: [...callStack], explanation: `Merging subarrays: [${L.join(', ')}] and [${R.join(', ')}].` };

    while (i < n1 && j < n2) {
      yield { type: 'compare', array: [...array], compareI: left + i, compareJ: mid + 1 + j, callStack: [...callStack], explanation: `Comparing ${L[i]} and ${R[j]}.` };
      
      if (L[i] <= R[j]) {
        array[k] = L[i];
        i++;
      } else {
        array[k] = R[j];
        j++;
      }
      yield { type: 'overwrite', array: [...array], activeIndex: k, callStack: [...callStack], explanation: `Wrote ${array[k]} into the main array at index ${k}.` };
      k++;
    }

    while (i < n1) {
      array[k] = L[i];
      yield { type: 'overwrite', array: [...array], activeIndex: k, callStack: [...callStack], explanation: `Flushing remaining left element ${L[i]} at index ${k}.` };
      i++; k++;
    }

    while (j < n2) {
      array[k] = R[j];
      yield { type: 'overwrite', array: [...array], activeIndex: k, callStack: [...callStack], explanation: `Flushing remaining right element ${R[j]} at index ${k}.` };
      j++; k++;
    }
  }

  function* mergeSortRecursive(left, right) {
    const frame = `mergeSort(${left}, ${right})`;
    callStack.push(frame);
    yield { type: 'split', array: [...array], left, right, callStack: [...callStack], explanation: `Splitting array from index ${left} to ${right}.` };

    if (left >= right) {
      callStack.pop();
      return;
    }

    let mid = Math.floor((left + right) / 2);
    
    yield* mergeSortRecursive(left, mid);
    yield* mergeSortRecursive(mid + 1, right);
    yield* merge(left, mid, right);

    callStack.pop();
    yield { type: 'return', array: [...array], left, right, callStack: [...callStack], explanation: `Subarray ${left} to ${right} is sorted. Popping from Call Stack.` };
  }

  yield* mergeSortRecursive(0, array.length - 1);
  yield { type: 'done', array: [...array], callStack: [], explanation: 'Merge Sort complete! The array is fully sorted.' };
}