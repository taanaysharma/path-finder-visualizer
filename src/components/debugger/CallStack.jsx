export default function CallStack({ stack = [] }) {
  return (
    <div className="h-full w-full overflow-y-auto flex flex-col gap-1">
      {stack.length === 0 ? (
        <div className="text-[var(--color-ink-500)] text-[11px] italic font-mono mt-1">Call stack is empty</div>
      ) : (
        [...stack].reverse().map((frame, idx) => (
          <div
            key={idx}
            className={`px-2.5 py-1.5 text-[11px] font-mono rounded border transition-all rise-in
              ${idx === 0
                ? 'bg-[var(--color-amber-signal-500)]/10 border-[var(--color-amber-signal-500)]/40 text-[var(--color-amber-signal-400)] shadow-[0_0_12px_-4px_var(--color-amber-signal-500)]'
                : 'bg-[var(--color-ink-850)] border-[var(--color-ink-700)]/50 text-[var(--color-ink-400)]'
              }`}
          >
            {idx === 0 && <span className="mr-1.5 opacity-70">▸</span>}
            {frame}
          </div>
        ))
      )}
    </div>
  );
}
