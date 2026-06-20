export function* floydWarshallGenerator(graph) {
  const nodes = Object.keys(graph);
  const n = nodes.length;
  const idx = Object.fromEntries(nodes.map((node, i) => [node, i]));

  // Initialize distance matrix
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const u of nodes) {
    for (const v in graph[u]) {
      dist[idx[u]][idx[v]] = graph[u][v];
    }
  }

  const snapshot = () => dist.map(row => [...row]);

  yield {
    type: 'start', nodes, matrix: snapshot(), k: null, i: null, j: null,
    explanation: `Initialized the ${n}×${n} distance matrix from direct edges. Diagonal is 0, unreachable pairs are ∞.`
  };

  for (let k = 0; k < n; k++) {
    yield {
      type: 'pivot', nodes, matrix: snapshot(), k, i: null, j: null,
      explanation: `Using ${nodes[k]} as the intermediate node. Checking if routing through ${nodes[k]} shortens any pair (i, j).`
    };

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j || i === k || j === k) continue;

        yield {
          type: 'compare', nodes, matrix: snapshot(), k, i, j,
          explanation: `Checking if dist[${nodes[i]}][${nodes[k]}] + dist[${nodes[k]}][${nodes[j]}] improves dist[${nodes[i]}][${nodes[j]}].`
        };

        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && dist[i][k] + dist[k][j] < dist[i][j]) {
          const oldVal = dist[i][j];
          dist[i][j] = dist[i][k] + dist[k][j];
          yield {
            type: 'update', nodes, matrix: snapshot(), k, i, j,
            explanation: `Shorter path found! dist[${nodes[i]}][${nodes[j]}] improved from ${oldVal === Infinity ? '∞' : oldVal} to ${dist[i][j]} via ${nodes[k]}.`
          };
        }
      }
    }
  }

  yield {
    type: 'done', nodes, matrix: snapshot(), k: null, i: null, j: null,
    explanation: 'Floyd-Warshall complete. The matrix now holds shortest-path distances between every pair of nodes.'
  };
}
