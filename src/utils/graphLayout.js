// Computes 2D positions (percentage coords, 0-100) for graph nodes.
// Starts with a circular layout, then runs a few iterations of simple
// spring relaxation (connected nodes attract, all nodes repel) so that
// graphs of arbitrary shape (entered as adjacency lists) don't overlap.

export function computeGraphLayout(adjacency) {
  const nodes = Object.keys(adjacency);
  const n = nodes.length;
  if (n === 0) return {};

  const positions = {};
  const cx = 50, cy = 50, radius = 36;
  nodes.forEach((node, idx) => {
    const angle = (idx / n) * 2 * Math.PI - Math.PI / 2;
    positions[node] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  if (n <= 2) return positions;

  // Build undirected edge set for attraction forces
  const edgeSet = new Set();
  nodes.forEach(u => {
    const neighbors = Array.isArray(adjacency[u]) ? adjacency[u] : Object.keys(adjacency[u] || {});
    neighbors.forEach(v => {
      if (adjacency[v] !== undefined) edgeSet.add([u, v].sort().join('|'));
    });
  });
  const edges = [...edgeSet].map(key => key.split('|'));

  const ITER = 120;
  const REPEL = 420;
  const ATTRACT = 0.02;
  const damping = 0.85;
  const velocities = {};
  nodes.forEach(n2 => { velocities[n2] = { x: 0, y: 0 }; });

  for (let iter = 0; iter < ITER; iter++) {
    const forces = {};
    nodes.forEach(n2 => { forces[n2] = { x: 0, y: 0 }; });

    // Repulsion between all pairs
    for (let a = 0; a < n; a++) {
      for (let b = a + 1; b < n; b++) {
        const A = nodes[a], B = nodes[b];
        let dx = positions[A].x - positions[B].x;
        let dy = positions[A].y - positions[B].y;
        let distSq = dx * dx + dy * dy;
        if (distSq < 0.01) { dx = (Math.random() - 0.5); dy = (Math.random() - 0.5); distSq = 0.01; }
        const force = REPEL / distSq;
        const dist = Math.sqrt(distSq);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        forces[A].x += fx; forces[A].y += fy;
        forces[B].x -= fx; forces[B].y -= fy;
      }
    }

    // Attraction along edges
    edges.forEach(([u, v]) => {
      const dx = positions[u].x - positions[v].x;
      const dy = positions[u].y - positions[v].y;
      forces[u].x -= dx * ATTRACT;
      forces[u].y -= dy * ATTRACT;
      forces[v].x += dx * ATTRACT;
      forces[v].y += dy * ATTRACT;
    });

    // Gentle pull toward center to keep things framed
    nodes.forEach(node => {
      forces[node].x += (cx - positions[node].x) * 0.01;
      forces[node].y += (cy - positions[node].y) * 0.01;
    });

    nodes.forEach(node => {
      velocities[node].x = (velocities[node].x + forces[node].x * 0.02) * damping;
      velocities[node].y = (velocities[node].y + forces[node].y * 0.02) * damping;
      positions[node].x += velocities[node].x;
      positions[node].y += velocities[node].y;
      // Clamp to canvas bounds with margin
      positions[node].x = Math.min(92, Math.max(8, positions[node].x));
      positions[node].y = Math.min(90, Math.max(10, positions[node].y));
    });
  }

  return positions;
}
