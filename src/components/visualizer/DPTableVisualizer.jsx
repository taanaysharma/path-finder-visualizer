export default function DPTableVisualizer({ currentState, algoKey }) {
  if (!currentState || !currentState.table) {
    return <div className="text-[var(--color-ink-500)] flex h-full items-center justify-center font-mono text-sm">Load data to begin…</div>;
  }

  const isLcs = algoKey === 'lcs';
  const { table, i, j, type, path } = currentState;
  const cellSize = table[0].length > 9 ? 36 : 44;

  const colHeaders = isLcs
    ? ['', ...currentState.str2.split('')]
    : Array.from({ length: table[0].length }, (_, idx) => idx);
  const rowHeaders = isLcs
    ? ['', ...currentState.str1.split('')]
    : Array.from({ length: table.length }, (_, idx) => idx === 0 ? 0 : idx);

  const pathSet = new Set((path || []).map(([r, c]) => `${r}-${c}`));

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4 p-6 overflow-auto">
      {isLcs && (
        <div className="flex gap-6 text-[12px] font-mono text-[var(--color-ink-300)]">
          <div>str1: <span className="text-[var(--color-cyan-signal-400)]">{currentState.str1}</span></div>
          <div>str2: <span className="text-[var(--color-violet-signal-400)]">{currentState.str2}</span></div>
        </div>
      )}
      {!isLcs && (
        <div className="text-[12px] font-mono text-[var(--color-ink-300)]">
          capacity W = <span className="text-[var(--color-signal-400)] font-bold">{currentState.capacity}</span>
          {currentState.itemWeight !== undefined && currentState.i > 0 && (
            <span className="ml-3">item {currentState.i}: w={currentState.weights[currentState.i - 1]}, v={currentState.values[currentState.i - 1]}</span>
          )}
        </div>
      )}

      <div className="inline-block">
        {/* Column header row */}
        <div className="flex">
          <div style={{ width: cellSize, height: cellSize }} className="flex items-center justify-center text-[10px] text-[var(--color-ink-600)] font-mono">
            {isLcs ? '' : 'i\\w'}
          </div>
          {colHeaders.map((h, colIdx) => (
            <div
              key={colIdx}
              className="flex items-center justify-center font-mono text-[11px] font-bold"
              style={{ width: cellSize, height: cellSize, color: colIdx === j ? 'var(--color-amber-signal-400)' : 'var(--color-ink-400)' }}
            >
              {h}
            </div>
          ))}
        </div>

        {table.map((row, rowIdx) => (
          <div className="flex" key={rowIdx}>
            <div
              className="flex items-center justify-center font-mono text-[11px] font-bold"
              style={{ width: cellSize, height: cellSize, color: rowIdx === i ? 'var(--color-amber-signal-400)' : 'var(--color-ink-400)' }}
            >
              {isLcs ? rowHeaders[rowIdx] : rowIdx}
            </div>
            {row.map((val, colIdx) => {
              const isTarget = rowIdx === i && colIdx === j;
              const onPath = pathSet.has(`${rowIdx}-${colIdx}`);

              let bg = 'var(--color-ink-850)';
              let border = 'var(--color-ink-700)';
              let textColor = 'var(--color-ink-200)';

              if (rowIdx === 0 || colIdx === 0) { bg = 'var(--color-ink-800)'; textColor = 'var(--color-ink-500)'; }
              if (onPath) { bg = 'color-mix(in srgb, var(--color-violet-signal-500) 22%, var(--color-ink-850))'; border = 'var(--color-violet-signal-500)'; textColor = 'var(--color-violet-signal-300)'; }
              if (isTarget) {
                border = 'var(--color-amber-signal-500)';
                if (type === 'match' || type === 'include') { bg = 'color-mix(in srgb, var(--color-signal-500) 28%, var(--color-ink-850))'; textColor = 'var(--color-signal-300)'; }
                else if (type === 'no_match' || type === 'too_heavy' || type === 'exclude') { bg = 'color-mix(in srgb, var(--color-amber-signal-500) 18%, var(--color-ink-850))'; textColor = 'var(--color-amber-signal-300)'; }
                else { bg = 'color-mix(in srgb, var(--color-amber-signal-500) 12%, var(--color-ink-850))'; }
              }

              return (
                <div
                  key={colIdx}
                  className="flex items-center justify-center font-mono text-[12px] font-semibold border transition-all duration-200"
                  style={{ width: cellSize, height: cellSize, background: bg, borderColor: border, color: textColor }}
                >
                  <span key={`${val}-${rowIdx}-${colIdx}-${type}`} className={isTarget ? 'number-flicker' : ''}>{val}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {currentState.sequence !== undefined && (
        <div className="text-[12px] font-mono text-[var(--color-ink-300)]">
          LCS so far: <span className="text-[var(--color-violet-signal-400)] font-bold">"{currentState.sequence}"</span>
        </div>
      )}
      {currentState.selectedItems && (
        <div className="text-[12px] font-mono text-[var(--color-ink-300)]">
          selected items: <span className="text-[var(--color-signal-400)] font-bold">#{currentState.selectedItems.join(', #')}</span>
        </div>
      )}
    </div>
  );
}
