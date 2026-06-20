function Pill({ label, value, tone = 'ink' }) {
  const toneMap = {
    signal: 'text-[var(--color-signal-400)] border-[var(--color-signal-500)]/30 bg-[var(--color-signal-500)]/10',
    amber: 'text-[var(--color-amber-signal-400)] border-[var(--color-amber-signal-500)]/30 bg-[var(--color-amber-signal-500)]/10',
    rose: 'text-[var(--color-rose-signal-400)] border-[var(--color-rose-signal-500)]/30 bg-[var(--color-rose-signal-500)]/10',
    ink: 'text-[var(--color-ink-200)] border-[var(--color-ink-600)] bg-[var(--color-ink-800)]',
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-[var(--color-ink-400)]">{label}</span>
      <span className={`font-mono text-[12px] px-2 py-0.5 rounded border ${toneMap[tone]}`}>{value}</span>
    </div>
  );
}

export default function ComplexityPanel({ algo }) {
  if (!algo) return null;
  const { complexity, summary, label } = algo;

  return (
    <div className="bg-[var(--color-ink-925)] rounded-lg border border-[var(--color-ink-700)]/60 p-3.5 flex flex-col gap-3">
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-400)] mb-1.5">Complexity — {label}</h3>
        <p className="text-[12px] text-[var(--color-ink-300)] leading-relaxed">{summary}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--color-ink-700)]/50">
        <div className="text-center">
          <div className="text-[10px] text-[var(--color-ink-500)] mb-1">Best</div>
          <div className="font-mono text-[13px] text-[var(--color-signal-400)]">{complexity.time.best}</div>
        </div>
        <div className="text-center border-x border-[var(--color-ink-700)]/50">
          <div className="text-[10px] text-[var(--color-ink-500)] mb-1">Average</div>
          <div className="font-mono text-[13px] text-[var(--color-amber-signal-400)]">{complexity.time.avg}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[var(--color-ink-500)] mb-1">Worst</div>
          <div className="font-mono text-[13px] text-[var(--color-rose-signal-400)]">{complexity.time.worst}</div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--color-ink-700)]/50">
        <Pill label="Space complexity" value={complexity.space} tone="ink" />
        {complexity.stable !== null && (
          <Pill label="Stable" value={complexity.stable ? 'Yes' : 'No'} tone={complexity.stable ? 'signal' : 'rose'} />
        )}
        {complexity.inPlace !== null && (
          <Pill label="In-place" value={complexity.inPlace ? 'Yes' : 'No'} tone={complexity.inPlace ? 'signal' : 'ink'} />
        )}
      </div>
    </div>
  );
}
