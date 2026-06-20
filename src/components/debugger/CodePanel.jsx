export default function CodePanel({ algo, currentState }) {
  if (!algo) return null;
  const activeLine = currentState ? algo.lineForStep(currentState) : -1;

  return (
    <div className="h-full flex flex-col bg-[var(--color-ink-925)] rounded-lg border border-[var(--color-ink-700)]/60 overflow-hidden">
      <div className="flex items-center gap-2 px-3 h-9 border-b border-[var(--color-ink-700)]/60 shrink-0 bg-[var(--color-ink-900)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-rose-signal-500)]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-amber-signal-500)]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-signal-500)]/70" />
        </div>
        <span className="text-[11px] text-[var(--color-ink-400)] font-mono ml-1">pseudocode.txt</span>
      </div>
      <div className="flex-1 overflow-y-auto py-2 font-mono text-[12.5px] leading-[1.9]">
        {algo.pseudocode.map((line, idx) => {
          const isActive = idx === activeLine;
          return (
            <div
              key={idx}
              className={`px-3 flex gap-3 transition-colors duration-150 relative ${isActive ? 'bg-[var(--color-signal-glow)]' : ''}`}
            >
              {isActive && <span className="absolute left-0 top-0 bottom-0 w-[2.5px] bg-[var(--color-signal-500)]" />}
              <span className="select-none w-4 text-right text-[var(--color-ink-500)] shrink-0">{idx + 1}</span>
              <span
                className={`whitespace-pre ${isActive ? 'text-[var(--color-signal-300)] font-medium' : 'text-[var(--color-ink-200)]'}`}
              >
                {line === '' ? ' ' : line}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
