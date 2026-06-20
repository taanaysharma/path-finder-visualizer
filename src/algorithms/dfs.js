export function* dfsGenerator(graph, startNode) {
  const visited = new Set();
  const callStack = [];

  function* explore(node) {
    callStack.push(`dfs('${node}')`);
    visited.add(node);

    yield { 
      type: 'visiting', currentNode: node, visited: Array.from(visited), 
      callStack: [...callStack], queue: [], explanation: `Visiting node ${node}. Added to visited set.` 
    };

    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      yield { 
        type: 'checking_neighbor', currentNode: node, neighbor, visited: Array.from(visited), 
        callStack: [...callStack], queue: [], explanation: `Checking neighbor ${neighbor} of node ${node}.` 
      };

      if (!visited.has(neighbor)) {
        // Recursive call delegates yields back to the engine
        yield* explore(neighbor);
      } else {
        yield { 
          type: 'skipping_neighbor', currentNode: node, neighbor, visited: Array.from(visited), 
          callStack: [...callStack], queue: [], explanation: `Neighbor ${neighbor} is already visited. Skipping.` 
        };
      }
    }

    callStack.pop();
    yield { 
      type: 'backtracking', currentNode: node, visited: Array.from(visited), 
      callStack: [...callStack], queue: [], explanation: `Finished exploring all neighbors of ${node}. Backtracking.` 
    };
  }

  // Start the initial recursive call
  yield* explore(startNode);
  
  yield { 
    type: 'done', currentNode: null, visited: Array.from(visited), 
    callStack: [], queue: [], explanation: `DFS traversal complete.` 
  };
}