export function* astarGenerator(graph, startNode, goalNode) {
  // Hardcoded Euclidean heuristic values based on your UI layout map
  // Real A* calculates this dynamically based on coordinates
  const heuristic = { A: 60, B: 40, C: 40, D: 20, E: 20, F: 0 }; 
  
  const gScore = {}; // Exact cost from start to node
  const fScore = {}; // Estimated total cost (gScore + heuristic)
  const priorityQueue = [];
  const visited = new Set();
  
  for (let node in graph) {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  }
  
  gScore[startNode] = 0;
  fScore[startNode] = heuristic[startNode];
  priorityQueue.push({ node: startNode, f: fScore[startNode] });

  yield { type: 'start', currentNode: null, distances: { ...gScore }, visited: Array.from(visited), queue: priorityQueue.map(i => `${i.node}(${i.f})`), explanation: `Starting A* Search for goal node ${goalNode}. Initializing f-scores.` };

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a.f - b.f);
    const { node: currentNode } = priorityQueue.shift();

    if (currentNode === goalNode) {
      yield { type: 'done', currentNode, distances: { ...gScore }, visited: Array.from(visited), explanation: `Goal Node ${goalNode} found! A* Search complete.` };
      return;
    }

    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    yield { type: 'visiting', currentNode, distances: { ...gScore }, visited: Array.from(visited), queue: priorityQueue.map(i => `${i.node}(${i.f})`), explanation: `Evaluating node ${currentNode}. (Heuristic distance to goal: ${heuristic[currentNode]})` };

    const neighbors = graph[currentNode] || {};
    for (const neighbor in neighbors) {
      const weight = neighbors[neighbor];
      
      yield { type: 'checking_neighbor', currentNode, neighbor, weight, distances: { ...gScore }, visited: Array.from(visited), explanation: `Checking neighbor ${neighbor} (Edge weight: ${weight}).` };

      if (visited.has(neighbor)) continue;

      const tentativeGScore = gScore[currentNode] + weight;

      if (tentativeGScore < gScore[neighbor]) {
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic[neighbor];
        
        // Add to queue or update existing
        priorityQueue.push({ node: neighbor, f: fScore[neighbor] });
        
        yield { type: 'updating_distance', currentNode, neighbor, newDist: tentativeGScore, fScore: fScore[neighbor], distances: { ...gScore }, visited: Array.from(visited), queue: priorityQueue.map(i => `${i.node}(${i.f})`), explanation: `Found a better path to ${neighbor}. gScore updated to ${tentativeGScore}. New fScore (g+h) is ${fScore[neighbor]}. Added to Priority Queue.` };
      }
    }
  }

  yield { type: 'failed', distances: { ...gScore }, explanation: `Priority Queue exhausted. Goal Node ${goalNode} could not be reached.` };
}