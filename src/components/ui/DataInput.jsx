import { useState, useEffect } from 'react';

export default function DataInput({ activeAlgo, loadCustomData }) {
  const [arrayInput, setArrayInput] = useState('38, 27, 43, 3, 9, 82, 10, 19, 50, 12');
  const [targetInput, setTargetInput] = useState('23');
  
  // Graph input uses JSON for complex nested objects
  const defaultGraph = `{\n  "A": ["B", "C"],\n  "B": ["A", "D", "E"],\n  "C": ["A", "F"],\n  "D": ["B"],\n  "E": ["B"],\n  "F": ["C"]\n}`;
  const [graphInput, setGraphInput] = useState(defaultGraph);
  const [startNodeInput, setStartNodeInput] = useState('A');

  const isArrayAlgo = activeAlgo === 'quickSort' || activeAlgo === 'binarySearch';

  const handleRun = () => {
    if (isArrayAlgo) {
      // 1. Parse the string into an array of integers
      const parsedArray = arrayInput
        .split(',')
        .map(str => parseInt(str.trim()))
        .filter(num => !isNaN(num)); // Remove invalid entries

      if (parsedArray.length === 0) {
        alert("Please enter a valid comma-separated list of numbers.");
        return;
      }

      if (activeAlgo === 'binarySearch') {
        const target = parseInt(targetInput.trim());
        if (isNaN(target)) return alert("Please enter a valid target number.");
        
        // Binary search strictly requires a sorted array
        const sortedArray = [...parsedArray].sort((a, b) => a - b);
        loadCustomData(activeAlgo, sortedArray, target);
      } else {
        loadCustomData(activeAlgo, parsedArray);
      }
    } else {
      // 2. Parse the Graph JSON
      try {
        const parsedGraph = JSON.parse(graphInput);
        const startNode = startNodeInput.trim();
        loadCustomData(activeAlgo, parsedGraph, startNode);
      } catch (error) {
        alert("Invalid Graph format. Please ensure it is valid JSON.");
      }
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-start md:items-center z-10 shadow-sm">
      <div className="flex-1 w-full">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          {isArrayAlgo ? 'Custom Array (Comma-separated)' : 'Custom Graph (JSON Adjacency List)'}
        </label>
        
        {isArrayAlgo ? (
          <input 
            type="text" 
            value={arrayInput} 
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="e.g. 5, 12, 8, 3, 20"
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
          />
        ) : (
          <textarea 
            value={graphInput} 
            onChange={(e) => setGraphInput(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors resize-none"
          />
        )}
      </div>

      <div className="flex items-end gap-4 w-full md:w-auto">
        {/* Extra inputs for specific algorithms */}
        {activeAlgo === 'binarySearch' && (
          <div className="w-24 shrink-0">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Target</label>
            <input 
              type="text" 
              value={targetInput} 
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-center"
            />
          </div>
        )}

        {(activeAlgo === 'bfs' || activeAlgo === 'dfs' || activeAlgo === 'dijkstra') && (
          <div className="w-24 shrink-0">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Start Node</label>
            <input 
              type="text" 
              value={startNodeInput} 
              onChange={(e) => setStartNodeInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-center"
            />
          </div>
        )}

        <button 
          onClick={handleRun}
          className="shrink-0 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-md transition-colors border border-slate-600"
        >
          Load Data
        </button>
      </div>
    </div>
  );
}