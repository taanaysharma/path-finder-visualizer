export function* knapsackGenerator(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  const snapshot = () => dp.map(row => [...row]);

  yield {
    type: 'start', weights, values, capacity, table: snapshot(), i: null, w: null,
    explanation: `Building a ${n + 1}×${capacity + 1} DP table. dp[i][w] = best value using the first i items within capacity w.`
  };

  for (let i = 1; i <= n; i++) {
    const itemWeight = weights[i - 1];
    const itemValue = values[i - 1];

    yield {
      type: 'item_start', weights, values, capacity, table: snapshot(), i, w: null, itemWeight, itemValue,
      explanation: `Considering item ${i}: weight=${itemWeight}, value=${itemValue}.`
    };

    for (let w = 0; w <= capacity; w++) {
      if (itemWeight > w) {
        dp[i][w] = dp[i - 1][w];
        yield {
          type: 'too_heavy', weights, values, capacity, table: snapshot(), i, w, itemWeight, itemValue,
          explanation: `Item ${i} (weight ${itemWeight}) doesn't fit in capacity ${w}. Carry forward dp[${i - 1}][${w}] = ${dp[i][w]}.`
        };
      } else {
        const includeValue = itemValue + dp[i - 1][w - itemWeight];
        const excludeValue = dp[i - 1][w];

        yield {
          type: 'compare', weights, values, capacity, table: snapshot(), i, w, itemWeight, itemValue,
          includeValue, excludeValue,
          explanation: `Capacity ${w}: include item ${i} → ${itemValue} + dp[${i - 1}][${w - itemWeight}] = ${includeValue}, vs exclude → dp[${i - 1}][${w}] = ${excludeValue}.`
        };

        dp[i][w] = Math.max(includeValue, excludeValue);

        yield {
          type: includeValue > excludeValue ? 'include' : 'exclude', weights, values, capacity, table: snapshot(), i, w,
          explanation: includeValue > excludeValue
            ? `Including item ${i} is better. dp[${i}][${w}] = ${dp[i][w]}.`
            : `Excluding item ${i} is at least as good. dp[${i}][${w}] = ${dp[i][w]}.`
        };
      }
    }
  }

  // Backtrack to find selected items
  let w = capacity;
  const selectedItems = [];
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.unshift(i);
      w -= weights[i - 1];
    }
  }

  yield {
    type: 'done', weights, values, capacity, table: snapshot(), result: dp[n][capacity], selectedItems,
    explanation: `Knapsack complete! Maximum value = ${dp[n][capacity]}, achieved using item(s) #${selectedItems.join(', #')}.`
  };
}
