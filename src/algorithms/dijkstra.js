export function* dijkstraGenerator(graph, startNode) {
  const distances = {};
  const visited = new Set();
  const priorityQueue = []; 

  // Initialize distances to Infinity
  for (let node in graph) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;
  priorityQueue.push({ node: startNode, dist: 0 });

  yield { 
    type: 'start', currentNode: null, distances: { ...distances }, visited: Array.from(visited), 
    queue: priorityQueue.map(i => `${i.node}(${i.dist})`), explanation: `Starting Dijkstra's algorithm from ${startNode}. All other distances set to Infinity.` 
  };

  while (priorityQueue.length > 0) {
    // Sort to simulate Priority Queue behavior (shortest distance first)
    priorityQueue.sort((a, b) => a.dist - b.dist);
    const { node: currentNode, dist: currentDist } = priorityQueue.shift();

    if (visited.has(currentNode)) continue;

    visited.add(currentNode);
    yield { 
      type: 'visiting', currentNode, distances: { ...distances }, visited: Array.from(visited), 
      queue: priorityQueue.map(i => `${i.node}(${i.dist})`), explanation: `Visiting node ${currentNode} with shortest known distance ${currentDist}.` 
    };

    const neighbors = graph[currentNode] || {};
    for (const neighbor in neighbors) {
      const weight = neighbors[neighbor];
      
      yield { 
        type: 'checking_neighbor', currentNode, neighbor, weight, distances: { ...distances }, visited: Array.from(visited), 
        queue: priorityQueue.map(i => `${i.node}(${i.dist})`), explanation: `Evaluating neighbor ${neighbor}. Edge weight is ${weight}.` 
      };

      if (!visited.has(neighbor)) {
        const newDist = currentDist + weight;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          priorityQueue.push({ node: neighbor, dist: newDist });
          
          yield { 
            type: 'updating_distance', currentNode, neighbor, newDist, distances: { ...distances }, visited: Array.from(visited), 
            queue: priorityQueue.map(i => `${i.node}(${i.dist})`), explanation: `Found a shorter path to ${neighbor} (Total: ${newDist}). Updating distance and adding to priority queue.` 
          };
        }
      }
    }
  }

  yield { 
    type: 'done', currentNode: null, distances: { ...distances }, visited: Array.from(visited), 
    queue: [], explanation: `Dijkstra's algorithm complete. Shortest paths from ${startNode} have been calculated.` 
  };
}