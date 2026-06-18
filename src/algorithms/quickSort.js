export function* quickSortGenerator(array) {
  let arr = [...array];
  let callStack = []; // Manually track the call stack for the debugger

  // Helper generator for the recursive calls
  function* qs(low, high) {
    const stackFrame = `quickSort(low: ${low}, high: ${high})`;
    callStack.push(stackFrame);

    yield { type: 'call', array: [...arr], low, high, pivotIndex: null, callStack: [...callStack], explanation: `Pushed ${stackFrame} to the Call Stack.` };

    if (low < high) {
      let pi = yield* partition(low, high);
      
      // Recursive calls using yield* (generator delegation)
      yield* qs(low, pi - 1);
      yield* qs(pi + 1, high);
    }

    callStack.pop();
    yield { type: 'return', array: [...arr], low, high, pivotIndex: null, callStack: [...callStack], explanation: `Popped ${stackFrame} from the Call Stack.` };
  }

  // Helper generator for the partition logic
  function* partition(low, high) {
    let pivot = arr[high];
    let i = low - 1;

    yield { type: 'partition_start', array: [...arr], low, high, i, j: low, pivot, callStack: [...callStack], explanation: `Partitioning subarray. Pivot is ${pivot}.` };

    for (let j = low; j < high; j++) {
      yield { type: 'compare', array: [...arr], low, high, i, j, pivot, callStack: [...callStack], explanation: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}).` };
      
      if (arr[j] < pivot) {
        i++;
        // Swap arr[i] and arr[j]
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        yield { type: 'swap', array: [...arr], low, high, i, j, pivot, callStack: [...callStack], explanation: `Swapped elements at index ${i} and ${j}.` };
      }
    }
    
    // Swap arr[i+1] and arr[high] (putting pivot in correct place)
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    yield { type: 'partition_done', array: [...arr], low, high, pivotIndex: i + 1, callStack: [...callStack], explanation: `Partition complete. Pivot ${pivot} is now locked in its sorted position at index ${i + 1}.` };
    return i + 1;
  }

  // Start the initial call
  yield* qs(0, arr.length - 1);
  yield { type: 'done', array: [...arr], callStack: [], explanation: 'QuickSort complete! The array is fully sorted.' };
}