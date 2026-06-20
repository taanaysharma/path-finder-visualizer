function QueenIcon({ color }) {
  return (
    <svg width="62%" height="62%" viewBox="0 0 24 24" fill={color}>
      <path d="M5 20h14l1-2H4l1 2zM6 16l-1-7 3 2 2-5 2 4 2-4 2 5 3-2-1 7H6z" />
    </svg>
  );
}

export default function BoardVisualizer({ currentState }) {
  if (!currentState || !currentState.board) {
    return <div className="text-[var(--color-ink-500)] flex h-full items-center justify-center font-mono text-sm">Load data to begin…</div>;
  }

  const { n, board, row, col, type, solutionsFound } = currentState;
  const cellSize = n >= 8 ? 44 : n >= 6 ? 52 : 62;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4 p-6">
      <div className="text-[12px] font-mono text-[var(--color-ink-300)]">
        N = {n} &nbsp;·&nbsp; solutions found:{' '}
        <span className="text-[var(--color-signal-400)] font-bold number-flicker" key={solutionsFound}>{solutionsFound}</span>
      </div>

      <div className="inline-block border-2 border-[var(--color-ink-700)] rounded-md overflow-hidden shadow-2xl">
        {Array.from({ length: n }).map((_, r) => (
          <div key={r} className="flex">
            {Array.from({ length: n }).map((_, c) => {
              const isDark = (r + c) % 2 === 1;
              const hasQueen = board[r] === c;
              const isActiveCell = r === row && c === col;
              const isConflict = isActiveCell && type === 'conflict';
              const isTrying = isActiveCell && type === 'trying';
              const isPlaced = isActiveCell && type === 'place';

              let bg = isDark ? 'var(--color-ink-800)' : 'var(--color-ink-850)';
              if (isTrying) bg = 'color-mix(in srgb, var(--color-amber-signal-500) 25%, var(--color-ink-850))';
              if (isConflict) bg = 'color-mix(in srgb, var(--color-rose-signal-500) 30%, var(--color-ink-850))';
              if (isPlaced) bg = 'color-mix(in srgb, var(--color-signal-500) 25%, var(--color-ink-850))';

              return (
                <div
                  key={c}
                  className="flex items-center justify-center transition-colors duration-200 relative"
                  style={{ width: cellSize, height: cellSize, background: bg }}
                >
                  {hasQueen && (
                    <span className="number-flicker">
                      <QueenIcon color={isConflict ? 'var(--color-rose-signal-400)' : 'var(--color-signal-400)'} />
                    </span>
                  )}
                  {isConflict && !hasQueen && (
                    <span className="text-[var(--color-rose-signal-400)] text-xl font-bold">✕</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--color-ink-500)]">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-amber-signal-500)]" /> trying</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-signal-500)]" /> placed</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-rose-signal-500)]" /> conflict</span>
      </div>
    </div>
  );
}
