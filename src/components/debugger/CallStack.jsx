export default function CallStack({ stack = [] }) {
  return (
    <div className="h-full w-full bg-slate-950 p-3 rounded border border-slate-800 overflow-y-auto flex flex-col gap-1">
      {stack.length === 0 ? (
        <div className="text-slate-500 text-xs italic font-mono mt-2">Call stack is empty</div>
      ) : (
        // Reverse the array so the top of the stack appears at the top visually
        [...stack].reverse().map((frame, idx) => (
          <div 
            key={idx} 
            className={`px-3 py-2 text-xs font-mono rounded border transition-all 
              ${idx === 0 
                ? 'bg-amber-900/20 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]' // Active frame (Top of stack)
                : 'bg-slate-800/30 border-slate-700/50 text-slate-500' // Background frames
              }`}
          >
            {frame}
          </div>
        ))
      )}
    </div>
  );
}