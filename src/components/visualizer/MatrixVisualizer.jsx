export default function MatrixVisualizer({ currentState }) {
  if (!currentState || !currentState.matrix) {
    return <div className="text-[var(--color-ink-500)] flex h-full items-center justify-center font-mono text-sm">Load data to begin…</div>;
  }

  const { matrix, nodes, k, i, j, type } = currentState;
  const n = nodes.length;
  const cellSize = n > 7 ? 42 : 52;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-5 p-6 overflow-auto">
      {k !== null && k !== undefined && (
        <div className="text-[12px] font-mono text-[var(--color-ink-300)]">
          intermediate node <span className="text-[var(--color-violet-signal-400)] font-bold">k = {nodes[k]}</span>
        </div>
      )}

      <div className="inline-block">
        <div className="flex">
          <div style={{ width: cellSize, height: cellSize }} />
          {nodes.map((node, colIdx) => (
            <div
              key={colIdx}
              className="flex items-center justify-center font-mono text-[12px] font-bold"
              style={{
                width: cellSize, height: cellSize,
                color: colIdx === j ? 'var(--color-amber-signal-400)' : colIdx === k ? 'var(--color-violet-signal-400)' : 'var(--color-ink-400)',
              }}
            >
              {node}
            </div>
          ))}
        </div>

        {matrix.map((row, rowIdx) => (
          <div className="flex" key={rowIdx}>
            <div
              className="flex items-center justify-center font-mono text-[12px] font-bold"
              style={{
                width: cellSize, height: cellSize,
                color: rowIdx === i ? 'var(--color-amber-signal-400)' : rowIdx === k ? 'var(--color-violet-signal-400)' : 'var(--color-ink-400)',
              }}
            >
              {nodes[rowIdx]}
            </div>
            {row.map((val, colIdx) => {
              const isPivotRow = rowIdx === k;
              const isPivotCol = colIdx === k;
              const isTarget = rowIdx === i && colIdx === j;
              const isDiag = rowIdx === colIdx;

              let bg = 'var(--color-ink-850)';
              let border = 'var(--color-ink-700)';
              let textColor = val === Infinity ? 'var(--color-ink-600)' : 'var(--color-ink-100)';

              if (isDiag) { bg = 'var(--color-ink-800)'; }
              if ((isPivotRow || isPivotCol) && type !== 'done') { bg = 'color-mix(in srgb, var(--color-violet-signal-500) 12%, var(--color-ink-850))'; border = 'color-mix(in srgb, var(--color-violet-signal-500) 40%, transparent)'; }
              if (isTarget) {
                border = 'var(--color-amber-signal-500)';
                bg = type === 'update'
                  ? 'color-mix(in srgb, var(--color-signal-500) 25%, var(--color-ink-850))'
                  : 'color-mix(in srgb, var(--color-amber-signal-500) 18%, var(--color-ink-850))';
                textColor = type === 'update' ? 'var(--color-signal-300)' : 'var(--color-amber-signal-300)';
              }

              return (
                <div
                  key={colIdx}
                  className="flex items-center justify-center font-mono text-[12px] font-semibold border transition-all duration-200"
                  style={{ width: cellSize, height: cellSize, background: bg, borderColor: border, color: textColor }}
                >
                  <span key={`${val}-${rowIdx}-${colIdx}-${type}`} className={isTarget ? 'number-flicker' : ''}>
                    {val === Infinity ? '∞' : val}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--color-ink-500)]">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-violet-signal-500)]" /> pivot row/col</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-amber-signal-500)]" /> checking cell</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-signal-500)]" /> updated</span>
      </div>
    </div>
  );
}
