import { useState } from 'react';
import { useEngine } from './hooks/useEngine';
import { binarySearchGenerator } from './algorithms/binarySearch';
import { bfsGenerator } from './algorithms/bfs';
import { dfsGenerator } from './algorithms/dfs';
import { dijkstraGenerator } from './algorithms/dijkstra';
import { quickSortGenerator } from './algorithms/quickSort';
import ArrayVisualizer from './components/visualizer/ArrayVisualizer';
import GraphVisualizer from './components/visualizer/GraphVisualizer';
import QuickSortVisualizer from './components/visualizer/QuickSortVisualizer';
import CallStack from './components/debugger/CallStack';
import ControlBar from './components/ui/ControlBar';
import DataInput from './components/ui/DataInput'; // <-- IMPORT THE NEW COMPONENT

export default function App() {
  const engine = useEngine();
  const { currentState, loadAlgorithm } = engine;
  const [activeAlgo, setActiveAlgo] = useState('quickSort');

  // New handler to process data from the DataInput component
  const handleLoadCustomData = (algoType, parsedData, extraParam) => {
    switch (algoType) {
      case 'binarySearch':
        loadAlgorithm(binarySearchGenerator, parsedData, extraParam); // extraParam is 'target'
        break;
      case 'quickSort':
        loadAlgorithm(quickSortGenerator, parsedData);
        break;
      case 'bfs':
        loadAlgorithm(bfsGenerator, parsedData, extraParam); // extraParam is 'startNode'
        break;
      case 'dfs':
        loadAlgorithm(dfsGenerator, parsedData, extraParam);
        break;
      case 'dijkstra':
        loadAlgorithm(dijkstraGenerator, parsedData, extraParam);
        break;
      default:
        break;
    }
  };

  const tabs = [
    { id: 'quickSort', label: 'QuickSort' },
    { id: 'binarySearch', label: 'Binary Search' },
    { id: 'bfs', label: 'BFS' },
    { id: 'dfs', label: 'DFS' },
    { id: 'dijkstra', label: "Dijkstra's" }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 bg-slate-950 flex flex-col xl:flex-row gap-4 items-center justify-between z-20 shadow-md">
        <h1 className="text-xl font-bold tracking-tight text-emerald-400">
          Algorithmic Visualizer <span className="text-slate-500 font-normal text-sm ml-2">| Step Debugger</span>
        </h1>
        
        <div className="flex flex-wrap justify-center bg-slate-900 p-1 rounded-lg border border-slate-800">
          {tabs.map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveAlgo(tab.id)} 
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${activeAlgo === tab.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* NEW: Data Input Panel */}
      <DataInput activeAlgo={activeAlgo} loadCustomData={handleLoadCustomData} />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Visualizer Canvas */}
        <section className="flex-[2] p-4 border-r border-slate-800 relative bg-slate-900 overflow-hidden flex flex-col gap-4">
          
          {/* Explanation Tooltip */}
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-lg shadow-xl shrink-0 min-h-[5rem]">
             <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Execution Step Explanation</h3>
             <p className="text-sm text-slate-300 leading-relaxed">
               {currentState ? currentState.explanation : 'Enter data above and click "Load Data" to begin visualization.'}
             </p>
          </div>
          
          {/* Canvas */}
          <div className="flex-1 border border-slate-700/50 rounded-lg bg-slate-800/30 overflow-hidden relative">
            {(activeAlgo === 'binarySearch') && <ArrayVisualizer currentState={currentState} />}
            {(activeAlgo === 'quickSort') && <QuickSortVisualizer currentState={currentState} />}
            {(activeAlgo === 'bfs' || activeAlgo === 'dfs' || activeAlgo === 'dijkstra') && <GraphVisualizer currentState={currentState} />}
          </div>
        </section>

        {/* Right Side: Debugger Panel (Remains unchanged from your previous setup) */}
        <section className="flex-1 p-4 bg-slate-950 flex flex-col gap-4">
          <div className="flex-1 border border-slate-800 rounded-lg p-4 bg-slate-900/50 flex flex-col min-h-0">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-amber-500"></div> Call Stack
            </h2>
            <div className="flex-1 overflow-hidden">
               <CallStack stack={currentState?.callStack || []} />
            </div>
          </div>

          <div className="flex-1 border border-slate-800 rounded-lg p-4 bg-slate-900/50 min-h-0 overflow-y-auto">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div> Variable State
            </h2>
            
            {currentState && activeAlgo === 'quickSort' && (
              <div className="font-mono text-xs space-y-2 text-slate-300 bg-slate-950 p-4 rounded border border-slate-800">
                <div><span className="text-slate-400">low</span>: {currentState.low !== undefined ? currentState.low : 'null'}</div>
                <div><span className="text-slate-400">high</span>: {currentState.high !== undefined ? currentState.high : 'null'}</div>
                <div className="pt-2 border-t border-slate-800"><span className="text-purple-400">i</span> (swap marker): {currentState.i !== undefined ? currentState.i : 'null'}</div>
                <div><span className="text-blue-400">j</span> (scanner): {currentState.j !== undefined ? currentState.j : 'null'}</div>
                <div className="pt-2 border-t border-slate-800"><span className="text-amber-400">pivot</span>: {currentState.pivot !== undefined ? currentState.pivot : 'null'}</div>
              </div>
            )}
            
            {currentState && activeAlgo === 'binarySearch' && (
              <div className="font-mono text-sm space-y-2 text-slate-300 bg-slate-950 p-4 rounded border border-slate-800">
                <div><span className="text-blue-400">left</span>: {currentState.left}</div>
                <div><span className="text-purple-400">right</span>: {currentState.right}</div>
                <div><span className="text-amber-400">mid</span>: {currentState.mid !== null ? currentState.mid : 'null'}</div>
              </div>
            )}

            {currentState && (activeAlgo === 'bfs' || activeAlgo === 'dfs' || activeAlgo === 'dijkstra') && (
              <div className="font-mono text-sm space-y-2 text-slate-300 bg-slate-950 p-4 rounded border border-slate-800">
                <div><span className="text-blue-400">currentNode</span>: {currentState.currentNode || 'null'}</div>
                <div><span className="text-amber-400">evaluating</span>: {currentState.neighbor || 'null'}</div>
                {activeAlgo === 'dijkstra' && currentState.weight !== undefined && (
                  <div><span className="text-emerald-400">edge weight</span>: {currentState.weight}</div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer / Control Bar */}
      <footer className="h-20 border-t border-slate-800 bg-slate-950 flex items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-30">
        <ControlBar engine={engine} />
      </footer>
    </div>
  );
}