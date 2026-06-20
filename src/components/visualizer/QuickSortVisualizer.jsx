function PointerTag({ label, color }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rise-in">
      <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded" style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
        {label}
      </span>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M5 6L0 0H10L5 6Z" fill={color} /></svg>
    </div>
  );
}

export default function QuickSortVisualizer({ currentState }) {
  if (!currentState || !currentState.array) {
    return <div className="text-[var(--color-ink-500)] flex h-full items-center justify-center font-mono text-sm">Load data to begin…</div>;
  }

  const { array, low, high, i, j, pivotIndex, type } = currentState;
  const maxVal = Math.max(...array, 1);

  function getColors(index) {
    if (type === 'done') return { bar: 'var(--color-signal-500)', glow: 'transparent', text: 'var(--color-ink-950)' };
    if (index === pivotIndex) return { bar: 'var(--color-signal-500)', glow: 'var(--color-signal-500)', text: 'var(--color-ink-950)' };
    if (index === high && type !== 'return' && type !== 'call') return { bar: 'var(--color-violet-signal-500)', glow: 'var(--color-violet-signal-500)', text: 'var(--color-ink-950)' };
    if (index === j) return { bar: 'var(--color-amber-signal-500)', glow: 'var(--color-amber-signal-500)', text: 'var(--color-ink-950)' };
    if (index === i) return { bar: 'var(--color-cyan-signal-500)', glow: 'var(--color-cyan-signal-500)', text: 'var(--color-ink-950)' };
    if (low !== undefined && high !== undefined && index >= low && index <= high) return { bar: 'var(--color-ink-500)', glow: 'transparent', text: 'var(--color-ink-100)' };
    return { bar: 'var(--color-ink-700)', glow: 'transparent', text: 'var(--color-ink-200)' };
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-6 p-6">
      <div className="flex items-end justify-center gap-1.5 md:gap-2.5 w-full flex-1 max-h-full">
        {array.map((value, index) => {
          const colors = getColors(index);
          const heightPct = 18 + (value / maxVal) * 78;
          const isPointerHere = index === pivotIndex || index === high || index === j || index === i;

          return (
            <div key={index} className="flex flex-col items-center justify-end gap-1.5 h-full" style={{ flex: '1 1 0', maxWidth: '64px' }}>
              <div className="h-7 flex items-end justify-center w-full relative">
                {index === high && type !== 'done' && index !== pivotIndex && <PointerTag label="PIVOT" color="var(--color-violet-signal-500)" />}
                {index === j && type !== 'done' && <PointerTag label="j" color="var(--color-amber-signal-500)" />}
                {index === i && type !== 'done' && <PointerTag label="i" color="var(--color-cyan-signal-500)" />}
              </div>

              <div
                className="w-full rounded-md flex items-center justify-center font-mono font-bold text-[13px] md:text-[15px] transition-all duration-300 ease-out border"
                style={{
                  height: `${heightPct}%`,
                  background: `linear-gradient(180deg, ${colors.bar}, color-mix(in srgb, ${colors.bar} 80%, black))`,
                  borderColor: colors.bar,
                  color: colors.text,
                  boxShadow: isPointerHere && colors.glow !== 'transparent' ? `0 0 18px -2px ${colors.glow}` : 'none',
                  minHeight: '28px',
                }}
              >
                <span key={`${value}-${type}`} className={isPointerHere ? 'number-flicker' : ''}>{value}</span>
              </div>
              <div className="text-[10px] font-mono text-[var(--color-ink-500)]">{index}</div>
            </div>
          );
        })}
      </div>
      {low !== undefined && high !== undefined && type !== 'done' && (
        <div className="text-[11px] font-mono text-[var(--color-ink-400)]">
          partition range: <span className="text-[var(--color-ink-200)]">[{low}, {high}]</span>
        </div>
      )}
    </div>
  );
}
