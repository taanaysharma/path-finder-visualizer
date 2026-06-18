export default function GraphVisualizer({ currentState }) {
  if (!currentState || (!currentState.queue && !currentState.distances)) {
    return <div className="text-slate-500 flex h-full items-center justify-center">Loading Graph State...</div>;
  }

  const { currentNode, queue = [], visited = [], neighbor, type, distances } = currentState;

  const layout = { A: { x: 50, y: 20 }, B: { x: 30, y: 50 }, C: { x: 70, y: 50 }, D: { x: 15, y: 85 }, E: { x: 45, y: 85 }, F: { x: 85, y: 85 } };

  // Hardcoded edges with weights [node1, node2, weight]
  const edges = [
    ['A', 'B', 4], ['A', 'C', 2],
    ['B', 'D', 3], ['B', 'E', 1],
    ['C', 'F', 5]
  ];

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
       <div className="absolute top-4 right-4 bg-slate-900/80 p-4 rounded-lg border border-slate-700 text-sm shadow-lg backdrop-blur-sm z-10">
         <div className="mb-2 text-slate-300">
            <span className="text-slate-500 font-mono uppercase tracking-wider text-xs mr-2">Queue/Stack:</span> 
            [{queue.length > 0 ? queue.join(', ') : 'Empty'}]
         </div>
         <div className="text-slate-300">
            <span className="text-slate-500 font-mono uppercase tracking-wider text-xs mr-2">Visited:</span> 
            {visited.join(', ')}
         </div>
       </div>

       <svg className="w-full h-full absolute inset-0">
         {edges.map(([u, v, weight]) => {
           const isChecking = type === 'checking_neighbor' && ((currentNode === u && neighbor === v) || (currentNode === v && neighbor === u));
           // Calculate midpoint for the weight label
           const midX = (layout[u].x + layout[v].x) / 2;
           const midY = (layout[u].y + layout[v].y) / 2;

           return (
             <g key={`${u}-${v}`}>
               <line 
                 x1={`${layout[u].x}%`} y1={`${layout[u].y}%`}
                 x2={`${layout[v].x}%`} y2={`${layout[v].y}%`}
                 className={`stroke-2 transition-all duration-300 ${isChecking ? 'stroke-amber-400' : 'stroke-slate-700'}`}
               />
               {/* Show edge weights if distances exist in state (Dijkstra) */}
               {distances && (
                 <text x={`${midX}%`} y={`${midY}%`} dy="-5" textAnchor="middle" className="fill-slate-400 text-xs font-bold font-mono">
                   {weight}
                 </text>
               )}
             </g>
           );
         })}

         {Object.entries(layout).map(([node, pos]) => {
           let bgColor = "fill-slate-800";
           let strokeColor = "stroke-slate-600";
           let scale = "scale-100";
           
           if (node === currentNode) {
             bgColor = "fill-blue-600"; strokeColor = "stroke-blue-400"; scale = "scale-110";
           } else if (node === neighbor && (type === 'checking_neighbor' || type === 'updating_distance')) {
             bgColor = "fill-amber-500"; strokeColor = "stroke-amber-400";
           } else if (visited.includes(node)) {
             bgColor = "fill-emerald-600"; strokeColor = "stroke-emerald-400";
           }

           const dist = distances ? distances[node] : null;
           const distDisplay = dist === Infinity ? '∞' : dist;

           return (
             <g key={node} style={{ transform: `translate(${pos.x}%, ${pos.y}%)` }} className={`transition-all duration-300 ${scale}`}>
               {node === currentNode && <circle r="28" className="fill-blue-500/20 animate-ping" />}
               <circle r="22" className={`${bgColor} ${strokeColor} stroke-2`} />
               <text textAnchor="middle" dy=".35em" className="fill-white font-bold text-sm font-sans">{node}</text>
               
               {/* Shortest Distance Label for Dijkstra */}
               {distances && (
                 <text textAnchor="middle" dy="-35" className={`font-mono text-xs font-bold ${dist !== Infinity ? 'fill-emerald-400' : 'fill-slate-500'}`}>
                   {distDisplay}
                 </text>
               )}
             </g>
           );
         })}
       </svg>
    </div>
  );
}