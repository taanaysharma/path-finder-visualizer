import TraceTape from './TraceTape';

function IconButton({ onClick, disabled, title, children, accent }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-9 h-9 grid place-items-center rounded-md border transition-all disabled:opacity-30 disabled:cursor-not-allowed
        ${accent
          ? 'bg-[var(--color-signal-500)]/15 border-[var(--color-signal-500)]/40 text-[var(--color-signal-400)] hover:bg-[var(--color-signal-500)]/25'
          : 'bg-[var(--color-ink-800)] border-[var(--color-ink-600)] text-[var(--color-ink-300)] hover:text-[var(--color-ink-50)] hover:border-[var(--color-ink-500)]'}`}
    >
      {children}
    </button>
  );
}

export default function ControlBar({ engine }) {
  const {
    isPlaying, isFinished, speed, setSpeed,
    play, pause, stepForward, stepBackward,
    currentIndex, totalSteps, jumpToStep, runToCompletion,
  } = engine;

  return (
    <div className="w-full px-4 py-2.5 flex flex-col gap-2">
      <div className="flex items-center gap-4">
        {/* Transport controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <IconButton onClick={() => jumpToStep(0)} title="Jump to start">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 5v14M18 5l-9 7 9 7V5z" fill="currentColor" /></svg>
          </IconButton>
          <IconButton onClick={stepBackward} disabled={currentIndex <= 0} title="Step back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </IconButton>

          {isPlaying ? (
            <IconButton onClick={pause} accent title="Pause">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            </IconButton>
          ) : (
            <IconButton onClick={play} disabled={isFinished && currentIndex >= totalSteps - 1} accent title="Play">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8V4z" /></svg>
            </IconButton>
          )}

          <IconButton onClick={stepForward} disabled={isFinished && currentIndex >= totalSteps - 1} title="Step forward">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </IconButton>
          <IconButton onClick={runToCompletion} title="Run to completion">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          </IconButton>
        </div>

        {/* Trace tape scrubber */}
        <div className="flex-1 min-w-0">
          <TraceTape
            currentIndex={Math.max(0, currentIndex)}
            totalSteps={totalSteps}
            onScrub={jumpToStep}
          />
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-[var(--color-ink-500)] uppercase tracking-wide">Speed</span>
          <input
            type="range"
            min="50" max="1500" step="50"
            value={1550 - speed}
            onChange={(e) => setSpeed(1550 - parseInt(e.target.value))}
            className="w-20 accent-[var(--color-signal-500)] h-1"
          />
          <span className="text-[10px] font-mono text-[var(--color-ink-400)] w-10 text-right">{speed}ms</span>
        </div>

        {/* Status */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono shrink-0 pl-3 border-l border-[var(--color-ink-700)]/60">
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[var(--color-amber-signal-500)] pulse-ring' : isFinished ? 'bg-[var(--color-signal-500)]' : 'bg-[var(--color-ink-500)]'}`} />
          <span className="text-[var(--color-ink-400)] uppercase tracking-wide">
            {isPlaying ? 'running' : isFinished ? 'halted' : 'idle'}
          </span>
        </div>
      </div>
    </div>
  );
}
