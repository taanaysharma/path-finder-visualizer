export default function ControlBar({ engine }) {
  const { isPlaying, isFinished, speed, setSpeed, play, pause, stepForward, stepBackward } = engine;

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4">
      {/* Speed Slider */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Speed</label>
        <input 
          type="range" 
          min="100" max="2000" step="100" 
          // Reverse the visual slider so "right" is faster (lower ms)
          value={2100 - speed} 
          onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
          className="w-24 accent-emerald-500"
        />
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={stepBackward} 
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {isPlaying ? (
          <button onClick={pause} className="px-6 py-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/50 hover:bg-amber-500/20 transition-colors font-bold tracking-wide">
            PAUSE
          </button>
        ) : (
          <button 
            onClick={play} 
            disabled={isFinished}
            className="px-6 py-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors font-bold tracking-wide disabled:opacity-50 disabled:bg-slate-600 disabled:text-slate-400"
          >
            {isFinished ? 'FINISHED' : 'PLAY'}
          </button>
        )}

        <button 
          onClick={stepForward} 
          disabled={isFinished && !isPlaying}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Status */}
      <div className="text-xs font-mono text-slate-500">
        Engine Status: <span className={isPlaying ? "text-amber-400" : isFinished ? "text-emerald-400" : "text-slate-300"}>
          {isPlaying ? 'RUNNING' : isFinished ? 'HALTED' : 'IDLE'}
        </span>
      </div>
    </div>
  );
}
