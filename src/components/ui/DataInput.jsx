import { useState, useEffect } from 'react';
import { ALGORITHMS } from '../../algorithms/registry';

function FieldLabel({ children }) {
  return <label className="text-[10px] font-semibold text-[var(--color-ink-400)] uppercase tracking-wider block mb-1">{children}</label>;
}

const inputClass = "w-full bg-[var(--color-ink-950)] border border-[var(--color-ink-700)] rounded-md px-3 py-2 text-[13px] text-[var(--color-ink-100)] focus:outline-none focus:border-[var(--color-signal-500)] focus:ring-1 focus:ring-[var(--color-signal-500)]/40 font-mono transition-colors placeholder:text-[var(--color-ink-600)]";

function graphToText(graph) {
  return JSON.stringify(graph, null, 2);
}

export default function DataInput({ activeAlgo, loadCustomData, isOpen, setIsOpen }) {
  const algo = ALGORITHMS[activeAlgo];
  const shape = algo?.dataShape;
  const defaults = algo?.defaultData || {};

  const [arrayInput, setArrayInput] = useState('38, 27, 43, 3, 9, 82, 10, 19, 50, 12');
  const [targetInput, setTargetInput] = useState('23');
  const [graphInput, setGraphInput] = useState('{}');
  const [startNodeInput, setStartNodeInput] = useState('A');
  const [goalNodeInput, setGoalNodeInput] = useState('F');
  const [str1Input, setStr1Input] = useState('ABCBDAB');
  const [str2Input, setStr2Input] = useState('BDCABA');
  const [weightsInput, setWeightsInput] = useState('2, 3, 4, 5');
  const [valuesInput, setValuesInput] = useState('3, 4, 5, 6');
  const [capacityInput, setCapacityInput] = useState('8');
  const [nInput, setNInput] = useState('5');
  const [error, setError] = useState('');

  // Reset fields to this algorithm's defaults whenever the active algo changes
  useEffect(() => {
    if (!algo) return;
    setError('');
    if (shape === 'array' || shape === 'arrayWithTarget') {
      setArrayInput(defaults.array.join(', '));
      if (shape === 'arrayWithTarget') setTargetInput(String(defaults.target));
    }
    if (shape === 'graph' || shape === 'weightedGraph' || shape === 'weightedGraphWithGoal') {
      setGraphInput(graphToText(defaults.graph));
      if (defaults.startNode) setStartNodeInput(defaults.startNode);
      if (defaults.goalNode) setGoalNodeInput(defaults.goalNode);
    }
    if (shape === 'twoStrings') {
      setStr1Input(defaults.str1);
      setStr2Input(defaults.str2);
    }
    if (shape === 'knapsack') {
      setWeightsInput(defaults.weights.join(', '));
      setValuesInput(defaults.values.join(', '));
      setCapacityInput(String(defaults.capacity));
    }
    if (shape === 'n') {
      setNInput(String(defaults.n));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlgo]);

  const parseNumList = (str) => str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  const handleRun = () => {
    setError('');
    try {
      if (shape === 'array') {
        const arr = parseNumList(arrayInput);
        if (arr.length === 0) return setError('Enter a valid comma-separated list of numbers.');
        loadCustomData(activeAlgo, { array: arr });
      } else if (shape === 'arrayWithTarget') {
        const arr = parseNumList(arrayInput).sort((a, b) => a - b);
        const target = parseInt(targetInput.trim());
        if (arr.length === 0 || isNaN(target)) return setError('Enter a valid array and target.');
        loadCustomData(activeAlgo, { array: arr, target });
      } else if (shape === 'graph' || shape === 'weightedGraph' || shape === 'weightedGraphWithGoal') {
        const graph = JSON.parse(graphInput);
        if (typeof graph !== 'object' || Array.isArray(graph)) throw new Error('bad graph');
        const startNode = startNodeInput.trim();
        if (algo.needsStartNode && !(startNode in graph)) return setError(`Start node "${startNode}" not found in graph.`);
        if (shape === 'weightedGraphWithGoal') {
          const goalNode = goalNodeInput.trim();
          if (!(goalNode in graph)) return setError(`Goal node "${goalNode}" not found in graph.`);
          loadCustomData(activeAlgo, { graph, startNode, goalNode });
        } else if (algo.needsStartNode) {
          loadCustomData(activeAlgo, { graph, startNode });
        } else {
          loadCustomData(activeAlgo, { graph });
        }
      } else if (shape === 'twoStrings') {
        if (!str1Input.trim() || !str2Input.trim()) return setError('Enter both strings.');
        loadCustomData(activeAlgo, { str1: str1Input.trim(), str2: str2Input.trim() });
      } else if (shape === 'knapsack') {
        const weights = parseNumList(weightsInput);
        const values = parseNumList(valuesInput);
        const capacity = parseInt(capacityInput.trim());
        if (weights.length !== values.length || weights.length === 0) return setError('Weights and values must be equal-length, non-empty lists.');
        if (isNaN(capacity) || capacity <= 0) return setError('Enter a valid positive capacity.');
        loadCustomData(activeAlgo, { weights, values, capacity });
      } else if (shape === 'n') {
        const n = parseInt(nInput.trim());
        if (isNaN(n) || n < 1 || n > 10) return setError('N must be between 1 and 10 (larger boards get slow to brute-force).');
        loadCustomData(activeAlgo, { n });
      }
      setIsOpen(false);
    } catch {
      setError('Invalid JSON format for graph. Check your syntax.');
    }
  };

  if (!algo) return null;

  return (
    <div className={`border-b border-[var(--color-ink-700)]/60 bg-[var(--color-ink-925)] transition-all overflow-hidden ${isOpen ? 'max-h-[480px] overflow-y-auto' : 'max-h-0'}`}>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-400)]">Custom Input — {algo.label}</h3>
          <button onClick={() => setIsOpen(false)} className="text-[var(--color-ink-500)] hover:text-[var(--color-ink-200)] text-xs">✕</button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-start">
          {(shape === 'array' || shape === 'arrayWithTarget') && (
            <div className="flex-1 w-full">
              <FieldLabel>Array (comma-separated)</FieldLabel>
              <input type="text" value={arrayInput} onChange={e => setArrayInput(e.target.value)} placeholder="e.g. 5, 12, 8, 3, 20" className={inputClass} />
            </div>
          )}
          {shape === 'arrayWithTarget' && (
            <div className="w-28 shrink-0">
              <FieldLabel>Target</FieldLabel>
              <input type="text" value={targetInput} onChange={e => setTargetInput(e.target.value)} className={`${inputClass} text-center`} />
            </div>
          )}

          {(shape === 'graph' || shape === 'weightedGraph' || shape === 'weightedGraphWithGoal') && (
            <>
              <div className="flex-1 w-full">
                <FieldLabel>
                  Graph (JSON {shape === 'graph' ? 'adjacency list' : 'weighted adjacency map'})
                </FieldLabel>
                <textarea value={graphInput} onChange={e => setGraphInput(e.target.value)} rows={4} className={`${inputClass} resize-none`} />
              </div>
              <div className="flex gap-3 shrink-0">
                {algo.needsStartNode && (
                  <div className="w-24">
                    <FieldLabel>Start</FieldLabel>
                    <input type="text" value={startNodeInput} onChange={e => setStartNodeInput(e.target.value)} className={`${inputClass} text-center`} />
                  </div>
                )}
                {shape === 'weightedGraphWithGoal' && (
                  <div className="w-24">
                    <FieldLabel>Goal</FieldLabel>
                    <input type="text" value={goalNodeInput} onChange={e => setGoalNodeInput(e.target.value)} className={`${inputClass} text-center`} />
                  </div>
                )}
              </div>
            </>
          )}

          {shape === 'twoStrings' && (
            <>
              <div className="flex-1 w-full">
                <FieldLabel>String 1</FieldLabel>
                <input type="text" value={str1Input} onChange={e => setStr1Input(e.target.value)} className={inputClass} />
              </div>
              <div className="flex-1 w-full">
                <FieldLabel>String 2</FieldLabel>
                <input type="text" value={str2Input} onChange={e => setStr2Input(e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {shape === 'knapsack' && (
            <>
              <div className="flex-1 w-full">
                <FieldLabel>Weights</FieldLabel>
                <input type="text" value={weightsInput} onChange={e => setWeightsInput(e.target.value)} className={inputClass} />
              </div>
              <div className="flex-1 w-full">
                <FieldLabel>Values</FieldLabel>
                <input type="text" value={valuesInput} onChange={e => setValuesInput(e.target.value)} className={inputClass} />
              </div>
              <div className="w-28 shrink-0">
                <FieldLabel>Capacity</FieldLabel>
                <input type="text" value={capacityInput} onChange={e => setCapacityInput(e.target.value)} className={`${inputClass} text-center`} />
              </div>
            </>
          )}

          {shape === 'n' && (
            <div className="w-32 shrink-0">
              <FieldLabel>N (board size)</FieldLabel>
              <input type="text" value={nInput} onChange={e => setNInput(e.target.value)} className={`${inputClass} text-center`} />
            </div>
          )}

          <button
            onClick={handleRun}
            className="shrink-0 px-5 py-2 bg-[var(--color-signal-500)] hover:bg-[var(--color-signal-400)] text-[var(--color-ink-950)] font-semibold text-sm rounded-md transition-colors self-end"
          >
            Run
          </button>
        </div>

        {error && <div className="text-[12px] text-[var(--color-rose-signal-400)] font-mono">{error}</div>}
      </div>
    </div>
  );
}
