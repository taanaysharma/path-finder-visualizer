export function* nQueensGenerator(n) {
  const board = Array(n).fill(-1); // board[row] = col of queen in that row
  const callStack = [];
  let solutionsFound = 0;
  let firstSolution = null;

  yield {
    type: 'start', n, board: [...board], callStack: [], row: null, col: null,
    explanation: `Starting N-Queens for N=${n}. Placing queens row by row, backtracking on conflicts.`
  };

  function isSafe(row, col) {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  function* solve(row) {
    callStack.push(`place(row=${row})`);

    if (row === n) {
      solutionsFound++;
      if (!firstSolution) firstSolution = [...board];
      yield {
        type: 'solution_found', n, board: [...board], callStack: [...callStack], row, col: null, solutionsFound,
        explanation: `All ${n} queens placed safely! Found solution #${solutionsFound}.`
      };
      callStack.pop();
      return;
    }

    for (let col = 0; col < n; col++) {
      yield {
        type: 'trying', n, board: [...board], callStack: [...callStack], row, col, solutionsFound,
        explanation: `Trying to place a queen at row ${row}, column ${col}.`
      };

      if (isSafe(row, col)) {
        board[row] = col;
        yield {
          type: 'place', n, board: [...board], callStack: [...callStack], row, col, solutionsFound,
          explanation: `Safe! Placed queen at (${row}, ${col}). Recursing to row ${row + 1}.`
        };

        yield* solve(row + 1);

        board[row] = -1;
        yield {
          type: 'backtrack', n, board: [...board], callStack: [...callStack], row, col, solutionsFound,
          explanation: `Backtracking: removed queen from (${row}, ${col}) to try the next column.`
        };
      } else {
        yield {
          type: 'conflict', n, board: [...board], callStack: [...callStack], row, col, solutionsFound,
          explanation: `Conflict at (${row}, ${col}) — another queen shares a row, column, or diagonal. Skipping.`
        };
      }
    }

    callStack.pop();
  }

  yield* solve(0);

  yield {
    type: 'done', n, board: firstSolution || [...board], callStack: [], row: null, col: null, solutionsFound,
    explanation: `Search complete. Found ${solutionsFound} total solution(s) for N=${n}.`
  };
}
