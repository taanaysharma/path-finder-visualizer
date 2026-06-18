export function* bfsGenerator(graph, startNode) {
  const queue = [startNode];
  const visited = new Set([startNode]);
  const traversalOrder = [];

  // Yield initial state
  yield {
    type: 'start',
    currentNode: null,
    queue: [...queue],
    visited: Array.from(visited),
    traversalOrder: [...traversalOrder],
    explanation: `Starting BFS from node ${startNode}. Added to queue and marked as visited.`
  };

  while (queue.length > 0) {
    const currentNode = queue.shift();
    traversalOrder.push(currentNode);

    // Yield state after dequeuing
    yield {
      type: 'visiting',
      currentNode,
      queue: [...queue],
      visited: Array.from(visited),
      traversalOrder: [...traversalOrder],
      explanation: `Dequeued node ${currentNode}. Processing its neighbors.`
    };

    const neighbors = graph[currentNode] || [];
    
    for (const neighbor of neighbors) {
      // Yield state when looking at a specific neighbor
      yield {
        type: 'checking_neighbor',
        currentNode,
        neighbor,
        queue: [...queue],
        visited: Array.from(visited),
        traversalOrder: [...traversalOrder],
        explanation: `Checking neighbor ${neighbor} of node ${currentNode}.`
      };

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        // Yield state after enqueuing an unvisited neighbor
        yield {
          type: 'adding_neighbor',
          currentNode,
          neighbor,
          queue: [...queue],
          visited: Array.from(visited),
          traversalOrder: [...traversalOrder],
          explanation: `Neighbor ${neighbor} is unvisited. Marking as visited and pushing to the queue.`
        };
      } else {
         // Yield state when skipping a visited neighbor
         yield {
          type: 'skipping_neighbor',
          currentNode,
          neighbor,
          queue: [...queue],
          visited: Array.from(visited),
          traversalOrder: [...traversalOrder],
          explanation: `Neighbor ${neighbor} has already been visited. Skipping.`
        };
      }
    }
  }

  // Yield completion state
  yield {
    type: 'done',
    currentNode: null,
    queue: [...queue],
    visited: Array.from(visited),
    traversalOrder: [...traversalOrder],
    explanation: `Queue is empty. BFS traversal complete.`
  };
}