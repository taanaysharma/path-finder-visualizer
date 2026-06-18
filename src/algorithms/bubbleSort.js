export function* bubbleSortGenerator(initialArray) {
  let array = [...initialArray];
  let n = array.length;
  let swapped;

  yield { type: 'start', array: [...array], i: null, j: null, explanation: 'Starting Bubble Sort. Heaviest elements will "bubble" to the end.' };

  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', array: [...array], i, j, explanation: `Comparing index ${j} (${array[j]}) and ${j+1} (${array[j+1]}).` };

      if (array[j] > array[j + 1]) {
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        swapped = true;
        
        yield { type: 'swap', array: [...array], i, j, explanation: `Swapped! ${array[j+1]} was greater than ${array[j]}.` };
      }
    }
    yield { type: 'locked', array: [...array], lockedIndex: n - i - 1, explanation: `Pass complete. Element at index ${n - i - 1} is locked in place.` };
    
    if (!swapped) break; // Optimization
  }

  yield { type: 'done', array: [...array], explanation: 'No swaps occurred on the last pass. Array is fully sorted!' };
}