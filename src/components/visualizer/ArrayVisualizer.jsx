const PALETTE = {
  default:   { bar: 'var(--color-ink-600)',         glow: 'transparent' },
  compare:   { bar: 'var(--color-amber-signal-500)', glow: 'var(--color-amber-signal-500)' },
  swap:      { bar: 'var(--color-rose-signal-500)',  glow: 'var(--color-rose-signal-500)' },
  sorted:    { bar: 'var(--color-signal-500)',       glow: 'transparent' },
  pivot:     { bar: 'var(--color-violet-signal-500)', glow: 'var(--color-violet-signal-500)' },
  found:     { bar: 'var(--color-signal-500)',       glow: 'var(--color-signal-500)' },
  eliminated:{ bar: 'var(--color-ink-800)',          glow: 'transparent' },
  active:    { bar: 'var(--color-ink-500)',          glow: 'transparent' },
};

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

export default function ArrayVisualizer({ currentState, algoKey }) {
  if (!currentState || !currentState.array) {
    return <div className="text-[var(--color-ink-500)] flex h-full items-center justify-center font-mono text-sm">Load data to begin…</div>;
  }

  const { array, left, right, mid, target, type, i, j, sortedBoundary, heapSize, lockedIndex } = currentState;
  const isSearch = algoKey === 'binarySearch';
  const maxVal = Math.max(...array, 1);

  function classify(index) {
    if (isSearch) {
      if (left === undefined) return 'default';
      if (type === 'found' && index === mid) return 'found';
      if (index === mid && type === 'calculating_mid') return 'compare';
      if (index < left || index > right) return 'eliminated';
      return 'active';
    }
    // Sorting visualizers
    if (type === 'done') return 'sorted';
    if (heapSize !== undefined && heapSize !== null && index >= heapSize) return 'sorted';
    if (type === 'locked' && index === lockedIndex) return 'sorted';

    if (algoKey === 'bubbleSort') {
      // In bubble sort, i = completed passes (not an index pointer).
      // The last i elements (from the end) are locked in as sorted.
      if (i !== null && i !== undefined && index >= array.length - i) return 'sorted';
      if (type === 'swap' && (index === j || index === j + 1)) return 'swap';
      if (type === 'compare' && (index === j || index === j + 1)) return 'compare';
      return 'default';
    }

    // Insertion sort / heap sort: i and j are real index pointers
    if (type === 'swap' && (index === i || index === j)) return 'swap';
    if (type === 'compare' && (index === i || index === j)) return 'compare';
    if (type === 'shift' && index === j) return 'swap';
    if (type === 'insert' && index === j) return 'sorted';
    if (sortedBoundary !== undefined && index < sortedBoundary) return 'sorted';
    return 'default';
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-6 p-6">
      {isSearch && (
        <div className="text-sm font-mono text-[var(--color-ink-300)]">
          target = <span className="text-[var(--color-signal-400)] font-bold number-flicker" key={target}>{target}</span>
        </div>
      )}

      <div className="flex items-end justify-center gap-1.5 md:gap-2.5 w-full flex-1 max-h-full">
        {array.map((value, index) => {
          const state = classify(index);
          const colors = PALETTE[state] || PALETTE.default;
          const heightPct = isSearch ? undefined : 18 + (value / maxVal) * 78;
          const isBubble = algoKey === 'bubbleSort';
          const isPointerHere = isSearch
            ? (index === mid || index === left || index === right)
            : isBubble
              ? (index === j || index === j + 1)
              : (index === i || index === j);

          return (
            <div key={index} className="flex flex-col items-center justify-end gap-1.5 h-full" style={{ flex: '1 1 0', maxWidth: '64px' }}>
              {/* Pointer tags */}
              <div className="h-7 flex items-end justify-center w-full relative">
                {index === mid && <PointerTag label="MID" color="var(--color-amber-signal-500)" />}
                {index === left && index !== mid && <PointerTag label="L" color="var(--color-cyan-signal-500)" />}
                {index === right && index !== mid && <PointerTag label="R" color="var(--color-violet-signal-500)" />}
                {!isSearch && !isBubble && index === i && type !== 'swap' && <PointerTag label="i" color="var(--color-cyan-signal-500)" />}
                {!isSearch && !isBubble && index === j && <PointerTag label="j" color="var(--color-amber-signal-500)" />}
                {!isSearch && isBubble && index === j && <PointerTag label="j" color="var(--color-amber-signal-500)" />}
                {!isSearch && isBubble && index === j + 1 && <PointerTag label="j+1" color="var(--color-cyan-signal-500)" />}
              </div>

              {/* Bar / Box */}
              <div
                className="w-full rounded-md flex items-center justify-center font-mono font-bold text-[13px] md:text-[15px] transition-all duration-300 ease-out border"
                style={{
                  height: isSearch ? '52px' : `${heightPct}%`,
                  background: `linear-gradient(180deg, ${colors.bar}, color-mix(in srgb, ${colors.bar} 80%, black))`,
                  borderColor: colors.bar,
                  color: state === 'default' || state === 'active' || state === 'eliminated' ? 'var(--color-ink-100)' : 'var(--color-ink-950)',
                  boxShadow: isPointerHere && colors.glow !== 'transparent' ? `0 0 18px -2px ${colors.glow}` : 'none',
                  minHeight: '28px',
                }}
              >
                <span key={`${value}-${state}`} className={isPointerHere ? 'number-flicker' : ''}>{value}</span>
              </div>

              {/* Index label */}
              <div className="text-[10px] font-mono text-[var(--color-ink-500)]">{index}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
