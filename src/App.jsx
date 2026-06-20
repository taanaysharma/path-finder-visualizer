import { useState, useEffect, useCallback } from 'react';
import { useEngine } from './hooks/useEngine';
import { ALGORITHMS, CATEGORIES } from './algorithms/registry';

// Algorithm generator imports
import { binarySearchGenerator } from './algorithms/binarySearch';
import { bfsGenerator } from './algorithms/bfs';
import { dfsGenerator } from './algorithms/dfs';
import { dijkstraGenerator } from './algorithms/dijkstra';
import { quickSortGenerator } from './algorithms/quickSort';
import { mergeSortGenerator } from './algorithms/mergeSort';
import { bubbleSortGenerator } from './algorithms/bubbleSort';
import { insertionSortGenerator } from './algorithms/insertionSort';
import { heapSortGenerator } from './algorithms/heapSort';
import { kruskalGenerator } from './algorithms/kruskal';
import { astarGenerator } from './algorithms/astar';
import { bellmanFordGenerator } from './algorithms/bellmanFord';
import { floydWarshallGenerator } from './algorithms/floydWarshall';
import { lcsGenerator } from './algorithms/lcs';
import { knapsackGenerator } from './algorithms/knapsack';
import { nQueensGenerator } from './algorithms/nQueens';

// Component imports
import ArrayVisualizer from './components/visualizer/ArrayVisualizer.jsx';
import MergeSortVisualizer from './components/visualizer/MergeSortVisualizer.jsx';
import GraphVisualizer from './components/visualizer/GraphVisualizer.jsx';
import QuickSortVisualizer from './components/visualizer/QuickSortVisualizer.jsx';
import MatrixVisualizer from './components/visualizer/MatrixVisualizer.jsx';
import DPTableVisualizer from './components/visualizer/DPTableVisualizer.jsx';
import BoardVisualizer from './components/visualizer/BoardVisualizer.jsx';
import CallStack from './components/debugger/CallStack.jsx';
import VariablePanel from './components/debugger/VariablePanel.jsx';
import CodePanel from './components/debugger/CodePanel.jsx';
import ComplexityPanel from './components/debugger/ComplexityPanel.jsx';
import ControlBar from './components/ui/ControlBar.jsx';
import DataInput from './components/ui/DataInput.jsx';
import Sidebar from './components/ui/Sidebar.jsx';

const GENERATORS = {
  bubbleSort: (d) => [bubbleSortGenerator, d.array],
  insertionSort: (d) => [insertionSortGenerator, d.array],
  heapSort: (d) => [heapSortGenerator, d.array],
  mergeSort: (d) => [mergeSortGenerator, d.array],
  quickSort: (d) => [quickSortGenerator, d.array],
  binarySearch: (d) => [binarySearchGenerator, d.array, d.target],
  bfs: (d) => [bfsGenerator, d.graph, d.startNode],
  dfs: (d) => [dfsGenerator, d.graph, d.startNode],
  dijkstra: (d) => [dijkstraGenerator, d.graph, d.startNode],
  astar: (d) => [astarGenerator, d.graph, d.startNode, d.goalNode],
  kruskal: (d) => [kruskalGenerator, d.graph],
  bellmanFord: (d) => [bellmanFordGenerator, d.graph, d.startNode],
  floydWarshall: (d) => [floydWarshallGenerator, d.graph],
  lcs: (d) => [lcsGenerator, d.str1, d.str2],
  knapsack: (d) => [knapsackGenerator, d.weights, d.values, d.capacity],
  nQueens: (d) => [nQueensGenerator, d.n],
};

export default function App() {
  const engine = useEngine();
  const { currentState, loadAlgorithm } = engine;
  const [activeAlgo, setActiveAlgo] = useState('bubbleSort');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const [graphData, setGraphData] = useState(null); // tracks the live graph for GraphVisualizer's layout

  const algo = ALGORITHMS[activeAlgo];

  const runLoad = useCallback((algoKey, data) => {
    const [gen, ...args] = GENERATORS[algoKey](data);
    loadAlgorithm(gen, ...args);
    if (data.graph) setGraphData(data.graph);
  }, [loadAlgorithm]);

  const handleLoadCustomData = (algoKey, data) => runLoad(algoKey, data);

  // Load defaults whenever the active algorithm changes
  useEffect(() => {
    const a = ALGORITHMS[activeAlgo];
    if (a) runLoad(activeAlgo, a.defaultData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlgo]);

  const renderVisualizer = () => {
    switch (algo.visualizer) {
      case 'array':
        return <ArrayVisualizer currentState={currentState} algoKey={activeAlgo} />;
      case 'mergeSort':
        return <MergeSortVisualizer currentState={currentState} />;
      case 'quickSort':
        return <QuickSortVisualizer currentState={currentState} />;
      case 'graph':
        return <GraphVisualizer currentState={currentState} graphData={graphData} algoKey={activeAlgo} />;
      case 'matrix':
        return <MatrixVisualizer currentState={currentState} />;
      case 'dpTable':
        return <DPTableVisualizer currentState={currentState} algoKey={activeAlgo} />;
      case 'board':
        return <BoardVisualizer currentState={currentState} />;
      default:
        return null;
    }
  };

  // mergeSort routes through the dedicated visualizer, not 'array'
  const visualizerOverride = activeAlgo === 'mergeSort' ? <MergeSortVisualizer currentState={currentState} /> : renderVisualizer();

  return (
    <div className="h-screen w-screen bg-[var(--color-ink-950)] text-[var(--color-ink-100)] flex font-body overflow-hidden">
      <Sidebar activeAlgo={activeAlgo} setActiveAlgo={setActiveAlgo} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 shrink-0 border-b border-[var(--color-ink-700)]/60 bg-[var(--color-ink-925)] flex items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-display font-bold text-[15px] text-[var(--color-ink-50)] truncate">{algo.label}</h1>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0"
              style={{ borderColor: `color-mix(in srgb, ${algo && CATEGORIES[algo.category].color} 35%, transparent)`, color: algo && CATEGORIES[algo.category].color }}
            >
              {algo && CATEGORIES[algo.category].label}
            </span>
          </div>
          <button
            onClick={() => setInputOpen(o => !o)}
            className="shrink-0 flex items-center gap-1.5 text-[12px] font-mono px-3 py-1.5 rounded-md border border-[var(--color-ink-600)] text-[var(--color-ink-300)] hover:text-[var(--color-signal-400)] hover:border-[var(--color-signal-500)]/50 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" /></svg>
            Custom Input
          </button>
        </header>

        <DataInput activeAlgo={activeAlgo} loadCustomData={handleLoadCustomData} isOpen={inputOpen} setIsOpen={setInputOpen} />

        {/* Explanation strip */}
        <div className="px-4 py-2.5 border-b border-[var(--color-ink-700)]/60 bg-[var(--color-ink-900)] shrink-0">
          <div className="flex items-start gap-2">
            <span className="text-[var(--color-amber-signal-500)] text-[10px] font-mono mt-0.5 shrink-0 uppercase tracking-wide">▸ trace</span>
            <p key={currentState?.explanation} className="text-[13px] text-[var(--color-ink-200)] leading-relaxed rise-in">
              {currentState ? currentState.explanation : 'Loading…'}
            </p>
          </div>
        </div>

        {/* Main workspace */}
        <main className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <section className="flex-1 bg-grid bg-[var(--color-ink-950)] relative overflow-auto min-w-0">
            {visualizerOverride}
          </section>

          {/* Right inspector rail */}
          <aside className="w-[300px] shrink-0 border-l border-[var(--color-ink-700)]/60 bg-[var(--color-ink-925)] flex flex-col overflow-y-auto p-3 gap-3">
            <div className="h-[180px] shrink-0">
              <CodePanel algo={algo} currentState={currentState} />
            </div>

            <div className="bg-[var(--color-ink-925)] rounded-lg border border-[var(--color-ink-700)]/60 p-3 flex flex-col gap-2 shrink-0">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-400)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber-signal-500)]" /> Call Stack
              </h2>
              <div className="max-h-[120px] overflow-y-auto">
                <CallStack stack={currentState?.callStack || []} />
              </div>
            </div>

            <div className="bg-[var(--color-ink-925)] rounded-lg border border-[var(--color-ink-700)]/60 p-3 flex flex-col gap-1 shrink-0">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-400)] flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyan-signal-500)]" /> Variables
              </h2>
              <VariablePanel activeAlgo={activeAlgo} currentState={currentState} />
            </div>

            <ComplexityPanel algo={algo} />
          </aside>
        </main>

        {/* Footer transport controls */}
        <footer className="border-t border-[var(--color-ink-700)]/60 bg-[var(--color-ink-925)] shrink-0">
          <ControlBar engine={engine} />
        </footer>
      </div>
    </div>
  );
}
