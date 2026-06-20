export function* kruskalGenerator(graph) {
  const edges = [];
  const mstEdges = [];
  
  // 1. Extract all edges from the Adjacency List
  for (const u in graph) {
    for (const v in graph[u]) {
      // Ensure we don't duplicate undirected edges (A-B is same as B-A)
      if (u < v) edges.push({ u, v, weight: graph[u][v] });
    }
  }

  // 2. Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);

  yield { type: 'start', queue: edges.map(e => `${e.u}-${e.v}(${e.weight})`), mst: [], explanation: `Extracted and sorted all edges by weight for Kruskal's Algorithm.` };

  // 3. DSU Implementation
  const parent = {};
  const rank = {};
  Object.keys(graph).forEach(node => {
    parent[node] = node;
    rank[node] = 0;
  });

  function find(i) {
    if (parent[i] === i) return i;
    return find(parent[i]); // Basic find (Path compression omitted for visualization clarity)
  }

  function union(i, j) {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      if (rank[rootI] < rank[rootJ]) {
        parent[rootI] = rootJ;
      } else if (rank[rootI] > rank[rootJ]) {
        parent[rootJ] = rootI;
      } else {
        parent[rootJ] = rootI;
        rank[rootI]++;
      }
    }
  }

  // 4. Evaluate Edges
  for (const edge of edges) {
    yield { type: 'evaluating', currentNode: edge.u, neighbor: edge.v, weight: edge.weight, queue: edges.map(e => `${e.u}-${e.v}(${e.weight})`), mst: [...mstEdges], explanation: `Evaluating edge ${edge.u}-${edge.v} with weight ${edge.weight}. Checking DSU for cycles.` };

    const rootU = find(edge.u);
    const rootV = find(edge.v);

    if (rootU !== rootV) {
      union(rootU, rootV);
      mstEdges.push(edge);
      yield { type: 'accept', currentNode: edge.u, neighbor: edge.v, queue: edges.map(e => `${e.u}-${e.v}(${e.weight})`), mst: [...mstEdges], explanation: `Roots differ (${rootU} != ${rootV}). No cycle detected. Edge added to Minimum Spanning Tree.` };
    } else {
      yield { type: 'reject', currentNode: edge.u, neighbor: edge.v, queue: edges.map(e => `${e.u}-${e.v}(${e.weight})`), mst: [...mstEdges], explanation: `Both nodes have the same root (${rootU}). Adding this edge would create a cycle. Discarding.` };
    }
  }

  yield { type: 'done', mst: [...mstEdges], explanation: `Kruskal's Algorithm complete! Minimum Spanning Tree formed.` };
}