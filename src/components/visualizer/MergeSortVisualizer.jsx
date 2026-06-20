export default function MergeSortVisualizer({ currentState }) {
  if (!currentState || !currentState.array) {
    return <div className="text-[var(--color-ink-500)] flex h-full items-center justify-center font-mono text-sm">Load data to begin…</div>;
  }

  const { array, left, right, mid, compareI, compareJ, activeIndex, type } = currentState;
  const maxVal = Math.max(...array, 1);

  function getColors(index) {
    if (type === 'done') return { bar: 'var(--color-signal-500)', glow: 'transparent', text: 'var(--color-ink-950)' };
    if (index === activeIndex) return { bar: 'var(--color-signal-500)', glow: 'var(--color-signal-500)', text: 'var(--color-ink-950)' };
    if (index === compareI || index === compareJ) return { bar: 'var(--color-amber-signal-500)', glow: 'var(--color-amber-signal-500)', text: 'var(--color-ink-950)' };
    if (mid !== undefined && left !== undefined && right !== undefined) {
      if (index >= left && index <= mid) return { bar: 'var(--color-cyan-signal-500)', glow: 'transparent', text: 'var(--color-ink-950)' };
      if (index > mid && index <= right) return { bar: 'var(--color-violet-signal-500)', glow: 'transparent', text: 'var(--color-ink-950)' };
    }
    if (left !== undefined && right !== undefined && index >= left && index <= right) return { bar: 'var(--color-ink-500)', glow: 'transparent', text: 'var(--color-ink-100)' };
    return { bar: 'var(--color-ink-700)', glow: 'transparent', text: 'var(--color-ink-200)' };
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-6 p-6">
      <div className="flex items-end justify-center gap-1.5 md:gap-2.5 w-full flex-1 max-h-full">
        {array.map((value, index) => {
          const colors = getColors(index);
          const heightPct = 18 + (value / maxVal) * 78;
          const isPointerHere = index === activeIndex || index === compareI || index === compareJ;
          const isBoundary = index === left || index === right || index === mid;

          return (
            <div key={index} className="flex flex-col items-center justify-end gap-1.5 h-full" style={{ flex: '1 1 0', maxWidth: '64px' }}>
              <div className="h-7 flex items-end justify-center w-full">
                {isBoundary && type !== 'done' && (
                  <span
                    className="text-[9px] font-mono font-bold px-1 rounded rise-in"
                    style={{ color: colors.bar, background: `color-mix(in srgb, ${colors.bar} 12%, transparent)` }}
                  >
                    {index === mid ? 'MID' : index === left ? 'L' : 'R'}
                  </span>
                )}
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
                <span key={`${value}-${type}-${index}`} className={isPointerHere ? 'number-flicker' : ''}>{value}</span>
              </div>
              <div className="text-[10px] font-mono text-[var(--color-ink-500)]">{index}</div>
            </div>
          );
        })}
      </div>
      {left !== undefined && right !== undefined && type !== 'done' && (
        <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--color-ink-400)]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-cyan-signal-500)]" /> left half</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-violet-signal-500)]" /> right half</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-signal-500)]" /> written</span>
        </div>
      )}
    </div>
  );
}
