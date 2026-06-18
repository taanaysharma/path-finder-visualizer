import { useState, useEffect } from 'react';
import { useEngine } from './hooks/useEngine';

// Algorithm Imports
import { binarySearchGenerator } from './algorithms/binarySearch';
import { bfsGenerator } from './algorithms/bfs';
import { dfsGenerator } from './algorithms/dfs';
import { dijkstraGenerator } from './algorithms/dijkstra';
import { quickSortGenerator } from './algorithms/quickSort';
import { mergeSortGenerator } from './algorithms/mergeSort';
import { bubbleSortGenerator } from './algorithms/bubbleSort';
import { kruskalGenerator } from './algorithms/kruskal';
import { astarGenerator } from './algorithms/astar';

// Component Imports (with explicit .jsx for Vercel production build)
import ArrayVisualizer from './components/visualizer/ArrayVisualizer.jsx';
import GraphVisualizer from './components/visualizer/GraphVisualizer.jsx';
import QuickSortVisualizer from './components/visualizer/QuickSortVisualizer.jsx';
import CallStack from './components/debugger/CallStack.jsx';
import ControlBar from './components/ui/ControlBar.jsx';
import DataInput from './components/ui/DataInput.jsx';

export default function App() {
  const engine = useEngine();
  const { currentState, loadAlgorithm } = engine;
  const [activeAlgo, setActiveAlgo] = useState('bubbleSort');

  // Master handler for DataInput component
  const handleLoadCustomData = (algoType, parsedData, extraParam) => {
    switch (algoType) {
      case 'bubbleSort':
        loadAlgorithm(bubbleSortGenerator, parsedData);
        break;
      case 'mergeSort':
        loadAlgorithm(mergeSortGenerator, parsedData);
        break;
      case 'quickSort':
        loadAlgorithm(quickSortGenerator, parsedData);
        break;
      case 'binarySearch':
        loadAlgorithm(binarySearchGenerator, parsedData, extraParam); // extraParam is 'target'
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
      case 'astar':
        // A* requires a goal node. We default to 'F' based on our UI layout map.
        loadAlgorithm(astarGenerator, parsedData, extraParam, 'F');
        break;
      case 'kruskal':
        loadAlgorithm(kruskalGenerator, parsedData);
        break;
      default:
        break;
    }
  };
// Add this right below handleLoadCustomData inside App.jsx
  useEffect(() => {
    const defaultArray = [38, 27, 43, 3, 9, 82, 10, 19, 50, 12];
    const defaultGraph = { A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F'], D: ['B'], E: ['B'], F: ['C'] };
    const defaultWeighted = { A: { B: 4, C: 2 }, B: { A: 4, D: 3, E: 1 }, C: { A: 2, F: 5 }, D: { B: 3 }, E: { B: 1 }, F: { C: 5 } };

    if (activeAlgo === 'bubbleSort') loadAlgorithm(bubbleSortGenerator, defaultArray);
    if (activeAlgo === 'mergeSort') loadAlgorithm(mergeSortGenerator, defaultArray);
    if (activeAlgo === 'quickSort') loadAlgorithm(quickSortGenerator, defaultArray);
    if (activeAlgo === 'binarySearch') loadAlgorithm(binarySearchGenerator, [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23);
    if (activeAlgo === 'bfs') loadAlgorithm(bfsGenerator, defaultGraph, 'A');
    if (activeAlgo === 'dfs') loadAlgorithm(dfsGenerator, defaultGraph, 'A');
    if (activeAlgo === 'dijkstra') loadAlgorithm(dijkstraGenerator, defaultWeighted, 'A');
    if (activeAlgo === 'astar') loadAlgorithm(astarGenerator, defaultWeighted, 'A', 'F');
    if (activeAlgo === 'kruskal') loadAlgorithm(kruskalGenerator, defaultWeighted);
  }, [activeAlgo, loadAlgorithm]);
  const tabs = [
    { id: 'bubbleSort', label: 'Bubble Sort' },
    { id: 'mergeSort', label: 'Merge Sort' },
    { id: 'quickSort', label: 'QuickSort' },
    { id: 'binarySearch', label: 'Binary Search' },
    { id: 'bfs', label: 'BFS' },
    { id: 'dfs', label: 'DFS' },
    { id: 'dijkstra', label: "Dijkstra's" },
    { id: 'astar', label: 'A* Search' },
    { id: 'kruskal', label: "Kruskal's" }
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

      {/* Data Input Panel */}
      <DataInput activeAlgo={activeAlgo} loadCustomData={handleLoadCustomData} />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Visualizer Canvas */}
        <section className="flex-[2] p-4 border-r border-slate-800 relative bg-slate-900 overflow-hidden flex flex-col gap-4">
          
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-lg shadow-xl shrink-0 min-h-[5rem]">
             <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Execution Step Explanation</h3>
             <p className="text-sm text-slate-300 leading-relaxed">
               {currentState ? currentState.explanation : 'Enter data above and click "Load Data" to begin visualization.'}
             </p>
          </div>
          
          <div className="flex-1 border border-slate-700/50 rounded-lg bg-slate-800/30 overflow-hidden relative">
            {(activeAlgo === 'binarySearch' || activeAlgo === 'bubbleSort' || activeAlgo === 'mergeSort') && <ArrayVisualizer currentState={currentState} />}
            {(activeAlgo === 'quickSort') && <QuickSortVisualizer currentState={currentState} />}
            {(activeAlgo === 'bfs' || activeAlgo === 'dfs' || activeAlgo === 'dijkstra' || activeAlgo === 'astar' || activeAlgo === 'kruskal') && <GraphVisualizer currentState={currentState} />}
          </div>
        </section>

        {/* Right Side: Debugger Panel */}
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
            
            {currentState && (
              <div className="font-mono text-sm space-y-2 text-slate-300 bg-slate-950 p-4 rounded border border-slate-800">
                {/* Array Sorting Variables */}
                {activeAlgo === 'bubbleSort' && (
                  <>
                    <div><span className="text-purple-400">i</span> (pass): {currentState.i !== null ? currentState.i : 'null'}</div>
                    <div><span className="text-blue-400">j</span> (scanner): {currentState.j !== null ? currentState.j : 'null'}</div>
                  </>
                )}
                
                {activeAlgo === 'mergeSort' && (
                  <>
                    <div><span className="text-slate-400">left</span>: {currentState.left !== undefined ? currentState.left : 'null'}</div>
                    <div><span className="text-slate-400">right</span>: {currentState.right !== undefined ? currentState.right : 'null'}</div>
                    <div className="pt-2 border-t border-slate-800"><span className="text-amber-400">mid</span>: {currentState.mid !== undefined ? currentState.mid : 'null'}</div>
                  </>
                )}

                {activeAlgo === 'quickSort' && (
                  <>
                    <div><span className="text-slate-400">low</span>: {currentState.low !== undefined ? currentState.low : 'null'}</div>
                    <div><span className="text-slate-400">high</span>: {currentState.high !== undefined ? currentState.high : 'null'}</div>
                    <div className="pt-2 border-t border-slate-800"><span className="text-purple-400">i</span> (swap marker): {currentState.i !== undefined ? currentState.i : 'null'}</div>
                    <div><span className="text-blue-400">j</span> (scanner): {currentState.j !== undefined ? currentState.j : 'null'}</div>
                    <div className="pt-2 border-t border-slate-800"><span className="text-amber-400">pivot</span>: {currentState.pivot !== undefined ? currentState.pivot : 'null'}</div>
                  </>
                )}

                {activeAlgo === 'binarySearch' && (
                  <>
                    <div><span className="text-blue-400">left</span>: {currentState.left}</div>
                    <div><span className="text-purple-400">right</span>: {currentState.right}</div>
                    <div><span className="text-amber-400">mid</span>: {currentState.mid !== null ? currentState.mid : 'null'}</div>
                  </>
                )}

                {/* Graph Variables */}
                {(activeAlgo === 'bfs' || activeAlgo === 'dfs' || activeAlgo === 'dijkstra' || activeAlgo === 'astar' || activeAlgo === 'kruskal') && (
                  <>
                    <div><span className="text-blue-400">currentNode</span>: {currentState.currentNode || 'null'}</div>
                    <div><span className="text-amber-400">evaluating</span>: {currentState.neighbor || 'null'}</div>
                    {currentState.weight !== undefined && (
                      <div><span className="text-emerald-400">edge weight</span>: {currentState.weight}</div>
                    )}
                    {activeAlgo === 'astar' && currentState.fScore !== undefined && (
                      <div><span className="text-purple-400">f-score</span>: {currentState.fScore}</div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="h-20 border-t border-slate-800 bg-slate-950 flex items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-30">
        <ControlBar engine={engine} />
      </footer>
    </div>
  );
}
