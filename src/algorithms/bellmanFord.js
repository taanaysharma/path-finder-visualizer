export function* bellmanFordGenerator(graph, startNode) {
  const nodes = Object.keys(graph);
  const distances = {};
  const predecessor = {};

  // Build an edge list from the weighted adjacency list
  const edges = [];
  for (const u of nodes) {
    for (const v in graph[u]) {
      edges.push({ u, v, weight: graph[u][v] });
    }
  }

  nodes.forEach(node => { distances[node] = Infinity; predecessor[node] = null; });
  distances[startNode] = 0;

  yield {
    type: 'start', currentNode: null, distances: { ...distances }, visited: [],
    explanation: `Starting Bellman-Ford from ${startNode}. Will relax all ${edges.length} edges up to ${nodes.length - 1} times.`
  };

  for (let iteration = 1; iteration <= nodes.length - 1; iteration++) {
    let updatedThisPass = false;

    yield {
      type: 'pass_start', currentNode: null, distances: { ...distances }, visited: [], pass: iteration,
      explanation: `Pass ${iteration} of ${nodes.length - 1}: scanning every edge for a possible relaxation.`
    };

    for (const edge of edges) {
      yield {
        type: 'checking_neighbor', currentNode: edge.u, neighbor: edge.v, weight: edge.weight,
        distances: { ...distances }, visited: [], pass: iteration,
        explanation: `Checking edge ${edge.u} → ${edge.v} (weight ${edge.weight}). dist[${edge.u}] = ${distances[edge.u] === Infinity ? '∞' : distances[edge.u]}.`
      };

      if (distances[edge.u] !== Infinity && distances[edge.u] + edge.weight < distances[edge.v]) {
        distances[edge.v] = distances[edge.u] + edge.weight;
        predecessor[edge.v] = edge.u;
        updatedThisPass = true;

        yield {
          type: 'updating_distance', currentNode: edge.u, neighbor: edge.v, newDist: distances[edge.v],
          distances: { ...distances }, visited: [], pass: iteration,
          explanation: `Relaxed! dist[${edge.v}] improved to ${distances[edge.v]} via ${edge.u}.`
        };
      }
    }

    if (!updatedThisPass) {
      yield {
        type: 'early_stop', currentNode: null, distances: { ...distances }, visited: [], pass: iteration,
        explanation: `No edge was relaxed in pass ${iteration}. Distances have converged — stopping early.`
      };
      break;
    }
  }

  // Negative cycle detection pass
  let hasNegativeCycle = false;
  for (const edge of edges) {
    if (distances[edge.u] !== Infinity && distances[edge.u] + edge.weight < distances[edge.v]) {
      hasNegativeCycle = true;
      yield {
        type: 'negative_cycle', currentNode: edge.u, neighbor: edge.v,
        distances: { ...distances }, visited: [],
        explanation: `Edge ${edge.u} → ${edge.v} can still be relaxed after ${nodes.length - 1} passes — a negative-weight cycle exists!`
      };
      break;
    }
  }

  yield {
    type: 'done', currentNode: null, distances: { ...distances }, visited: nodes, hasNegativeCycle,
    explanation: hasNegativeCycle
      ? 'Bellman-Ford complete. Negative cycle detected — shortest paths are undefined for affected nodes.'
      : `Bellman-Ford complete. Shortest paths from ${startNode} have been calculated.`
  };
}
