export function* binarySearchGenerator(array, target) {
  let left = 0;
  let right = array.length - 1;

  // Yield initial state
  yield {
    type: 'start',
    left, 
    right, 
    mid: null,
    array, 
    target,
    explanation: `Starting Binary Search. Looking for target ${target}.`
  };

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    // Yield state after calculating mid
    yield {
      type: 'calculating_mid',
      left, 
      right, 
      mid,
      array, 
      target,
      explanation: `Calculated mid index: ${mid} (Value at mid: ${array[mid]}). Checking if it matches ${target}.`
    };

    if (array[mid] === target) {
      // Yield success state
      yield {
        type: 'found',
        left, 
        right, 
        mid,
        array, 
        target,
        explanation: `Success! Target ${target} found at index ${mid}.`
      };
      return mid; // Generator is done
    }

    if (array[mid] < target) {
      // Yield update left state
      yield {
        type: 'update_left',
        left, 
        right, 
        mid,
        array, 
        target,
        explanation: `Value ${array[mid]} is less than ${target}. The target must be in the right half. Moving left pointer to ${mid + 1}.`
      };
      left = mid + 1;
    } else {
      // Yield update right state
      yield {
        type: 'update_right',
        left, 
        right, 
        mid,
        array, 
        target,
        explanation: `Value ${array[mid]} is greater than ${target}. The target must be in the left half. Moving right pointer to ${mid - 1}.`
      };
      right = mid - 1;
    }
  }

  // Yield failure state
  yield {
    type: 'not_found',
    left, 
    right, 
    mid: null,
    array, 
    target,
    explanation: `Pointers crossed (left > right). Target ${target} is not in the array.`
  };
  
  return -1;
}