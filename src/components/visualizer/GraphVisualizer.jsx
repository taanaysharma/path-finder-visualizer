import { useState, useMemo, useRef, useCallback } from 'react';
import { computeGraphLayout } from '../../utils/graphLayout';

function buildEdgeList(graph) {
  const seen = new Set();
  const edges = [];
  for (const u in graph) {
    const val = graph[u];
    const neighbors = Array.isArray(val) ? val : Object.keys(val || {});
    neighbors.forEach(v => {
      const key = [u, v].sort().join('|');
      if (seen.has(key)) return;
      seen.add(key);
      const weight = Array.isArray(val) ? null : val[v];
      edges.push({ u, v, weight });
    });
  }
  return edges;
}

export default function GraphVisualizer({ currentState, graphData, algoKey }) {
  const graph = graphData || {};
  const nodes = useMemo(() => Object.keys(graph), [graph]);
  const baseLayout = useMemo(() => computeGraphLayout(graph), [graph]);
  const [dragLayout, setDragLayout] = useState({});
  const containerRef = useRef(null);
  const draggingNode = useRef(null);

  const layout = useMemo(() => {
    const merged = {};
    nodes.forEach(n => { merged[n] = dragLayout[n] || baseLayout[n] || { x: 50, y: 50 }; });
    return merged;
  }, [nodes, baseLayout, dragLayout]);

  const edges = useMemo(() => buildEdgeList(graph), [graph]);

  const handlePointerDown = (node) => (e) => {
    e.preventDefault();
    draggingNode.current = node;
  };

  const handlePointerMove = useCallback((e) => {
    if (!draggingNode.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(94, Math.max(6, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(92, Math.max(8, ((e.clientY - rect.top) / rect.height) * 100));
    setDragLayout(prev => ({ ...prev, [draggingNode.current]: { x, y } }));
  }, []);

  const handlePointerUp = useCallback(() => { draggingNode.current = null; }, []);

  const mst = currentState?.mst || [];
  const mstKeySet = useMemo(() => new Set(mst.map(e => [e.u, e.v].sort().join('|'))), [mst]);

  if (!currentState || nodes.length === 0) {
    return <div className="text-[var(--color-ink-500)] flex h-full items-center justify-center font-mono text-sm">Load a graph to begin…</div>;
  }

  const {
    currentNode, neighbor, visited = [], type, distances,
    queue = [], traversalOrder,
  } = currentState;

  function nodeState(node) {
    if (node === currentNode) return 'current';
    if (node === neighbor && (type === 'checking_neighbor' || type === 'updating_distance')) return 'checking';
    if (visited.includes(node)) return 'visited';
    return 'idle';
  }

  const NODE_COLORS = {
    current: { fill: 'var(--color-cyan-signal-500)', stroke: 'var(--color-cyan-signal-400)' },
    checking: { fill: 'var(--color-amber-signal-500)', stroke: 'var(--color-amber-signal-400)' },
    visited: { fill: 'var(--color-signal-600)', stroke: 'var(--color-signal-400)' },
    idle: { fill: 'var(--color-ink-800)', stroke: 'var(--color-ink-500)' },
  };

  return (
    <div className="relative w-full h-full min-h-[420px] flex flex-col">
      <div className="absolute top-3 right-3 z-10 bg-[var(--color-ink-900)]/90 backdrop-blur-sm border border-[var(--color-ink-700)]/60 rounded-lg p-3 text-[11px] font-mono max-w-[220px] space-y-1.5 shadow-lg">
        {queue && queue.length >= 0 && (algoKey === 'bfs' || algoKey === 'dijkstra' || algoKey === 'astar') && (
          <div>
            <span className="text-[var(--color-ink-500)] uppercase tracking-wide text-[9px]">Queue</span>
            <div className="text-[var(--color-ink-200)] truncate">[{queue.join(', ') || '—'}]</div>
          </div>
        )}
        <div>
          <span className="text-[var(--color-ink-500)] uppercase tracking-wide text-[9px]">Visited</span>
          <div className="text-[var(--color-signal-400)] truncate">{visited.join(', ') || '—'}</div>
        </div>
        {algoKey === 'kruskal' && (
          <div>
            <span className="text-[var(--color-ink-500)] uppercase tracking-wide text-[9px]">MST edges</span>
            <div className="text-[var(--color-violet-signal-400)] truncate">{(mst || []).map(e => `${e.u}-${e.v}`).join(', ') || '—'}</div>
          </div>
        )}
        <div className="pt-1 border-t border-[var(--color-ink-700)]/50 text-[var(--color-ink-500)] text-[9px]">drag nodes to rearrange</div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        className="flex-1 relative select-none"
      >
        <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {edges.map(({ u, v, weight }) => {
            const p1 = layout[u], p2 = layout[v];
            if (!p1 || !p2) return null;
            const isChecking = (type === 'checking_neighbor' || type === 'evaluating') && ((currentNode === u && neighbor === v) || (currentNode === v && neighbor === u));
            const isUpdating = (type === 'updating_distance' || type === 'accept') && ((currentNode === u && neighbor === v) || (currentNode === v && neighbor === u));
            const isRejected = type === 'reject' && ((currentNode === u && neighbor === v) || (currentNode === v && neighbor === u));
            const isMst = mstKeySet.has([u, v].sort().join('|'));
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            let stroke = 'var(--color-ink-700)';
            let strokeWidth = 0.5;
            let className = '';
            if (isMst) { stroke = 'var(--color-violet-signal-500)'; strokeWidth = 0.9; }
            if (isChecking) { stroke = 'var(--color-amber-signal-500)'; strokeWidth = 0.9; className = 'dash-flow'; }
            if (isUpdating) { stroke = 'var(--color-signal-500)'; strokeWidth = 0.9; }
            if (isRejected) { stroke = 'var(--color-rose-signal-500)'; strokeWidth = 0.8; }

            return (
              <g key={`${u}-${v}`}>
                <line
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={stroke} strokeWidth={strokeWidth} className={`transition-all duration-300 ${className}`}
                  vectorEffect="non-scaling-stroke"
                />
                {weight !== null && weight !== undefined && (
                  <g>
                    <rect x={midX - 3.2} y={midY - 2.4} width="6.4" height="4" rx="1" fill="var(--color-ink-925)" opacity="0.85" />
                    <text x={midX} y={midY} dy="0.3em" textAnchor="middle" fontSize="2.6" fontFamily="var(--font-mono)" fill={isChecking || isUpdating ? 'var(--color-amber-signal-400)' : isRejected ? 'var(--color-rose-signal-400)' : 'var(--color-ink-400)'}>
                      {weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {nodes.map(node => {
            const pos = layout[node];
            if (!pos) return null;
            const state = nodeState(node);
            const colors = NODE_COLORS[state];
            const dist = distances ? distances[node] : null;
            const distDisplay = dist === Infinity ? '∞' : dist;

            return (
              <g
                key={node}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseDown={handlePointerDown(node)}
                style={{ cursor: 'grab' }}
                className="transition-transform"
              >
                {state === 'current' && (
                  <circle r="5.5" fill="var(--color-cyan-signal-500)" opacity="0.3" className="pulse-ring" />
                )}
                <circle r="4.6" fill={colors.fill} stroke={colors.stroke} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                <text textAnchor="middle" dy="0.35em" fontSize="3.6" fontWeight="700" fontFamily="var(--font-display)" fill="var(--color-ink-950)">
                  {node}
                </text>
                {distances && (
                  <text textAnchor="middle" y="-7" fontSize="2.6" fontFamily="var(--font-mono)" fontWeight="600" fill={dist !== Infinity ? 'var(--color-signal-400)' : 'var(--color-ink-500)'}>
                    {distDisplay}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {traversalOrder && traversalOrder.length > 0 && (
        <div className="px-4 pb-2 text-[11px] font-mono text-[var(--color-ink-400)] flex items-center gap-1.5 flex-wrap">
          <span className="text-[var(--color-ink-500)] uppercase tracking-wide text-[9px] mr-1">Order:</span>
          {traversalOrder.map((n, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="text-[var(--color-signal-400)]">{n}</span>
              {idx < traversalOrder.length - 1 && <span className="text-[var(--color-ink-600)]">→</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
