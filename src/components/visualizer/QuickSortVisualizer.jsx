export default function QuickSortVisualizer({ currentState }) {
  if (!currentState || !currentState.array) {
    return <div className="text-slate-500 flex h-full items-center justify-center">Loading QuickSort...</div>;
  }

  const { array, low, high, i, j, pivot, pivotIndex, type } = currentState;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-8 p-8">
      {/* Array Canvas */}
      <div className="flex flex-wrap items-end justify-center gap-2 w-full">
        {array.map((value, index) => {
          let bgColor = "bg-slate-700";
          let borderColor = "border-slate-600";
          
          // Styling logic based on QuickSort state
          if (type === 'done') {
            bgColor = "bg-emerald-500";
            borderColor = "border-emerald-400";
          } else if (index === pivotIndex) {
            bgColor = "bg-emerald-600"; // Locked in place
            borderColor = "border-emerald-400";
          } else if (index === high && type !== 'return') {
            bgColor = "bg-amber-500"; // Current Pivot
            borderColor = "border-amber-400";
          } else if (index === j) {
            bgColor = "bg-blue-500"; // Scanning pointer J
            borderColor = "border-blue-400";
          } else if (index === i) {
            bgColor = "bg-purple-500"; // Swap boundary I
            borderColor = "border-purple-400";
          } else if (index >= low && index <= high) {
            bgColor = "bg-slate-600"; // Active partition boundary
          }

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              {/* Pointer Labels */}
              <div className="h-8 text-[10px] font-bold tracking-wider flex flex-col justify-end">
                {index === high && type !== 'done' && <span className="text-amber-400">PIVOT</span>}
                {index === j && type !== 'done' && <span className="text-blue-400">J</span>}
                {index === i && type !== 'done' && <span className="text-purple-400">I</span>}
              </div>
              
              {/* Array Bar/Block */}
              <div 
                className={`w-8 md:w-12 h-12 md:h-16 flex items-center justify-center rounded-md border-2 text-sm font-bold transition-all duration-300 ${bgColor} ${borderColor}`}
              >
                {value}
              </div>
              <div className="text-[10px] text-slate-500">{index}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}