// Generic A* Search. The heuristic is computed dynamically as the BFS
// hop-distance (in edges) from each node to the goal — this keeps the
// algorithm usable for ANY custom graph the user enters, rather than a
// hardcoded heuristic tied to one fixed layout.
function computeHopHeuristic(graph, goalNode) {
  const heuristic = {};
  Object.keys(graph).forEach(n => { heuristic[n] = Infinity; });
  if (!(goalNode in graph)) return heuristic;

  heuristic[goalNode] = 0;
  const queue = [goalNode];
  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor in graph[node]) {
      if (heuristic[neighbor] === Infinity) {
        heuristic[neighbor] = heuristic[node] + 1;
        queue.push(neighbor);
      }
    }
  }
  return heuristic;
}

export function* astarGenerator(graph, startNode, goalNode) {
  const heuristic = computeHopHeuristic(graph, goalNode);

  const gScore = {};
  const fScore = {};
  const priorityQueue = [];
  const visited = new Set();

  for (let node in graph) {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  }

  gScore[startNode] = 0;
  fScore[startNode] = heuristic[startNode];
  priorityQueue.push({ node: startNode, f: fScore[startNode] });

  yield {
    type: 'start', currentNode: null, distances: { ...gScore }, visited: Array.from(visited),
    queue: priorityQueue.map(i => `${i.node}(${i.f})`),
    explanation: `Starting A* Search for goal node ${goalNode}. Heuristic h(n) is the hop-distance to the goal.`
  };

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a.f - b.f);
    const { node: currentNode } = priorityQueue.shift();

    if (visited.has(currentNode)) continue;

    if (currentNode === goalNode) {
      visited.add(currentNode);
      yield {
        type: 'done', currentNode, distances: { ...gScore }, visited: Array.from(visited),
        explanation: `Goal node ${goalNode} reached! A* Search complete. Shortest distance: ${gScore[goalNode]}.`
      };
      return;
    }

    visited.add(currentNode);

    yield {
      type: 'visiting', currentNode, distances: { ...gScore }, visited: Array.from(visited),
      queue: priorityQueue.map(i => `${i.node}(${i.f})`),
      explanation: `Evaluating node ${currentNode}. Heuristic distance to goal: ${heuristic[currentNode] === Infinity ? '∞' : heuristic[currentNode]}.`
    };

    const neighbors = graph[currentNode] || {};
    for (const neighbor in neighbors) {
      const weight = neighbors[neighbor];

      yield {
        type: 'checking_neighbor', currentNode, neighbor, weight, distances: { ...gScore }, visited: Array.from(visited),
        explanation: `Checking neighbor ${neighbor} (edge weight: ${weight}).`
      };

      if (visited.has(neighbor)) continue;

      const tentativeGScore = gScore[currentNode] + weight;

      if (tentativeGScore < gScore[neighbor]) {
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + (heuristic[neighbor] === Infinity ? 0 : heuristic[neighbor]);
        priorityQueue.push({ node: neighbor, f: fScore[neighbor] });

        yield {
          type: 'updating_distance', currentNode, neighbor, newDist: tentativeGScore, fScore: fScore[neighbor],
          distances: { ...gScore }, visited: Array.from(visited), queue: priorityQueue.map(i => `${i.node}(${i.f})`),
          explanation: `Found a better path to ${neighbor}. g=${tentativeGScore}, f=g+h=${fScore[neighbor]}. Added to priority queue.`
        };
      }
    }
  }

  yield { type: 'failed', distances: { ...gScore }, visited: Array.from(visited), explanation: `Priority queue exhausted. Goal node ${goalNode} could not be reached.` };
}
