export default function ArrayVisualizer({ currentState }) {
  if (!currentState || !currentState.array) {
    return <div className="text-slate-500 flex h-full items-center justify-center">Loading Algorithm State...</div>;
  }

  const { array, left, right, mid, target, type } = currentState;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-8 p-8">
      {/* Target Display */}
      <div className="text-xl font-semibold text-slate-300">
        Searching for Target: <span className="text-emerald-400">{target}</span>
      </div>

      {/* Array Canvas */}
      <div className="flex flex-wrap items-end justify-center gap-2 w-full">
        {array.map((value, index) => {
          // Determine the color of the block based on the current algorithm state
          let bgColor = "bg-slate-700";
          let borderColor = "border-slate-600";
          let scale = "scale-100";

          if (index === mid) {
            bgColor = type === 'found' ? "bg-emerald-500" : "bg-amber-500";
            borderColor = type === 'found' ? "border-emerald-400" : "border-amber-400";
            scale = "scale-110 z-10 shadow-lg shadow-amber-500/20";
          } else if (index === left) {
            bgColor = "bg-blue-600";
            borderColor = "border-blue-400";
          } else if (index === right) {
            bgColor = "bg-purple-600";
            borderColor = "border-purple-400";
          } else if (index >= left && index <= right) {
            bgColor = "bg-slate-600"; // Active search area
          } else {
            bgColor = "bg-slate-800 opacity-50"; // Eliminated area
          }

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              {/* Pointer Labels */}
              <div className="h-6 text-xs font-bold tracking-wider">
                {index === mid && <span className={type === 'found' ? "text-emerald-400" : "text-amber-400"}>MID</span>}
                {index === left && index !== mid && <span className="text-blue-400">L</span>}
                {index === right && index !== mid && <span className="text-purple-400">R</span>}
              </div>
              
              {/* Array Block */}
              <div 
                className={`w-12 md:w-16 h-12 md:h-16 flex items-center justify-center rounded-md border-2 text-lg font-bold transition-all duration-300 ${bgColor} ${borderColor} ${scale}`}
              >
                {value}
              </div>
              
              {/* Index Label */}
              <div className="text-xs text-slate-500">{index}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}