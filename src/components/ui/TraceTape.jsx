import { useRef, useCallback } from 'react';

// A horizontal scrubber that visualizes every recorded step as a tick.
// Clicking or dragging jumps the engine to that step (debugger "trace tape").
export default function TraceTape({ currentIndex, totalSteps, history, onScrub }) {
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  const indexFromClientX = useCallback((clientX) => {
    if (!trackRef.current || totalSteps <= 1) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (totalSteps - 1));
  }, [totalSteps]);

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    onScrub(indexFromClientX(e.clientX));
  };
  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    onScrub(indexFromClientX(e.clientX));
  };
  const handlePointerUp = () => { draggingRef.current = false; };

  const progress = totalSteps > 1 ? currentIndex / (totalSteps - 1) : 0;

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-1 px-0.5">
        <span className="text-[10px] font-mono text-[var(--color-ink-400)]">
          STEP <span className="text-[var(--color-signal-400)]">{totalSteps > 0 ? currentIndex + 1 : 0}</span> / {totalSteps}
        </span>
        {history?.[currentIndex]?.type && (
          <span className="text-[10px] font-mono uppercase tracking-wide text-[var(--color-ink-500)]">
            {history[currentIndex].type.replaceAll('_', ' ')}
          </span>
        )}
      </div>
      <div
        ref={trackRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        className="relative h-6 flex items-center cursor-pointer group"
      >
        {/* Track background with tick marks per step */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-[var(--color-ink-800)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-signal-600)] to-[var(--color-signal-400)] transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {/* Tick marks */}
        {totalSteps > 1 && totalSteps <= 400 && (
          <div className="absolute inset-x-0 h-1.5 flex">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-[var(--color-ink-950)]/40 last:border-r-0" />
            ))}
          </div>
        )}
        {/* Playhead */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-[var(--color-signal-400)] border-2 border-[var(--color-ink-950)] shadow-[0_0_0_3px_var(--color-signal-glow)] transition-[left] duration-100 -translate-x-1/2"
          style={{ left: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
