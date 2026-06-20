function Row({ label, value, color = 'var(--color-ink-200)' }) {
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-[var(--color-ink-850)] transition-colors">
      <span className="text-[11px] font-mono" style={{ color: 'var(--color-ink-500)' }}>{label}</span>
      <span key={String(value)} className="text-[12px] font-mono font-semibold number-flicker" style={{ color }}>
        {value === null || value === undefined ? 'null' : String(value)}
      </span>
    </div>
  );
}

const C = {
  cyan: 'var(--color-cyan-signal-400)',
  amber: 'var(--color-amber-signal-400)',
  violet: 'var(--color-violet-signal-400)',
  signal: 'var(--color-signal-400)',
  rose: 'var(--color-rose-signal-400)',
};

export default function VariablePanel({ activeAlgo, currentState }) {
  if (!currentState) {
    return <div className="text-[var(--color-ink-500)] text-[11px] font-mono italic px-2">No active state</div>;
  }
  const s = currentState;

  const arraySort = ['bubbleSort', 'insertionSort', 'heapSort'].includes(activeAlgo);
  const graphAlgo = ['bfs', 'dfs', 'dijkstra', 'astar', 'kruskal', 'bellmanFord'].includes(activeAlgo);

  return (
    <div className="flex flex-col gap-0.5">
      {arraySort && (
        <>
          <Row label={activeAlgo === 'bubbleSort' ? 'i (passes done)' : 'i'} value={s.i} color={C.cyan} />
          <Row label="j" value={s.j} color={C.amber} />
          {s.key !== undefined && <Row label="key" value={s.key} color={C.violet} />}
          {s.sortedBoundary !== undefined && <Row label="sortedBoundary" value={s.sortedBoundary} color={C.signal} />}
          {s.heapSize !== undefined && <Row label="heapSize" value={s.heapSize} color={C.signal} />}
        </>
      )}

      {activeAlgo === 'mergeSort' && (
        <>
          <Row label="left" value={s.left} color={C.cyan} />
          <Row label="right" value={s.right} color={C.violet} />
          <Row label="mid" value={s.mid} color={C.amber} />
          <Row label="activeIndex" value={s.activeIndex} color={C.signal} />
        </>
      )}

      {activeAlgo === 'quickSort' && (
        <>
          <Row label="low" value={s.low} color={C.cyan} />
          <Row label="high" value={s.high} color={C.violet} />
          <Row label="i (boundary)" value={s.i} color={C.cyan} />
          <Row label="j (scanner)" value={s.j} color={C.amber} />
          <Row label="pivot" value={s.pivot} color={C.signal} />
        </>
      )}

      {activeAlgo === 'binarySearch' && (
        <>
          <Row label="left" value={s.left} color={C.cyan} />
          <Row label="right" value={s.right} color={C.violet} />
          <Row label="mid" value={s.mid} color={C.amber} />
          <Row label="target" value={s.target} color={C.signal} />
        </>
      )}

      {graphAlgo && (
        <>
          <Row label="currentNode" value={s.currentNode} color={C.cyan} />
          <Row label="neighbor" value={s.neighbor} color={C.amber} />
          {s.weight !== undefined && <Row label="edge weight" value={s.weight} color={C.signal} />}
          {s.newDist !== undefined && <Row label="newDist" value={s.newDist} color={C.signal} />}
          {activeAlgo === 'astar' && s.fScore !== undefined && <Row label="f-score" value={s.fScore} color={C.violet} />}
          {activeAlgo === 'bellmanFord' && s.pass !== undefined && <Row label="pass" value={s.pass} color={C.violet} />}
        </>
      )}

      {activeAlgo === 'floydWarshall' && (
        <>
          <Row label="k (pivot)" value={s.nodes && s.k !== null ? s.nodes[s.k] : null} color={C.violet} />
          <Row label="i" value={s.nodes && s.i !== null && s.i !== undefined ? s.nodes[s.i] : null} color={C.cyan} />
          <Row label="j" value={s.nodes && s.j !== null && s.j !== undefined ? s.nodes[s.j] : null} color={C.amber} />
        </>
      )}

      {activeAlgo === 'lcs' && (
        <>
          <Row label="i" value={s.i} color={C.cyan} />
          <Row label="j" value={s.j} color={C.amber} />
          <Row label="charA" value={s.charA} color={C.signal} />
          <Row label="charB" value={s.charB} color={C.violet} />
        </>
      )}

      {activeAlgo === 'knapsack' && (
        <>
          <Row label="item i" value={s.i} color={C.cyan} />
          <Row label="capacity w" value={s.w} color={C.amber} />
          <Row label="itemWeight" value={s.itemWeight} color={C.signal} />
          <Row label="itemValue" value={s.itemValue} color={C.violet} />
        </>
      )}

      {activeAlgo === 'nQueens' && (
        <>
          <Row label="row" value={s.row} color={C.cyan} />
          <Row label="col" value={s.col} color={C.amber} />
          <Row label="solutions" value={s.solutionsFound} color={C.signal} />
        </>
      )}
    </div>
  );
}
