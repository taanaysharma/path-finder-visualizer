export function* lcsGenerator(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  const snapshot = () => dp.map(row => [...row]);

  yield {
    type: 'start', str1, str2, table: snapshot(), i: null, j: null,
    explanation: `Building a ${m + 1}×${n + 1} DP table to find the Longest Common Subsequence of "${str1}" and "${str2}". Row/col 0 are base cases of 0.`
  };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const charA = str1[i - 1];
      const charB = str2[j - 1];

      yield {
        type: 'compare', str1, str2, table: snapshot(), i, j, charA, charB,
        explanation: `Comparing str1[${i - 1}]='${charA}' with str2[${j - 1}]='${charB}'.`
      };

      if (charA === charB) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        yield {
          type: 'match', str1, str2, table: snapshot(), i, j, charA, charB,
          explanation: `Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`
        };
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        yield {
          type: 'no_match', str1, str2, table: snapshot(), i, j, charA, charB,
          explanation: `No match. dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}.`
        };
      }
    }
  }

  // Backtrack to reconstruct the subsequence
  let i = m, j = n;
  const sequence = [];
  const path = [];
  while (i > 0 && j > 0) {
    path.push([i, j]);
    if (str1[i - 1] === str2[j - 1]) {
      sequence.unshift(str1[i - 1]);
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  yield {
    type: 'backtrack', str1, str2, table: snapshot(), path, sequence: sequence.join(''),
    explanation: `Backtracking from dp[${m}][${n}] to reconstruct the subsequence: "${sequence.join('')}".`
  };

  yield {
    type: 'done', str1, str2, table: snapshot(), result: dp[m][n], sequence: sequence.join(''),
    explanation: `LCS complete! Length = ${dp[m][n]}. One valid subsequence is "${sequence.join('')}".`
  };
}
