# Pathfinder — Algorithm Trace Debugger

An interactive, step-by-step visual debugger for 16 classic algorithms — sorting, searching, graph traversal, shortest paths, minimum spanning trees, dynamic programming, and backtracking. Built to look and feel like an IDE debugger: synced pseudocode highlighting, a live call stack, a scrubbable execution timeline, and real-time variable inspection.

## Why this project

Most algorithm visualizers either animate a single hardcoded example or just draw bars moving around. This one is built like a real debugger:

- Every algorithm is implemented as a **JavaScript generator function** that `yield`s one step at a time — the exact technique used by real interactive debuggers and the basis for tools like Redux DevTools' time-travel.
- A single **execution engine hook** (`useEngine`) drives all 16 algorithms uniformly: play/pause, step forward/backward, jump to any step, or run to completion — with a full history buffer so you can scrub backward through past states with no recomputation.
- A **synced code panel** highlights the exact pseudocode line responsible for the current step, the same way breakpoint highlighting works in VS Code.
- A **call stack panel** mirrors actual recursive call frames for DFS, Merge Sort, Quick Sort, and N-Queens.
- Graphs are **not hardcoded** — any custom adjacency list (weighted or unweighted) is laid out automatically using a force-directed layout algorithm, and nodes are draggable.

## Algorithms

| Category | Algorithms |
|---|---|
| Sorting | Bubble Sort, Insertion Sort, Heap Sort, Merge Sort, Quick Sort |
| Searching | Binary Search |
| Graph Traversal | BFS, DFS |
| Shortest Path | Dijkstra's Algorithm, A* Search, Bellman-Ford, Floyd-Warshall |
| Minimum Spanning Tree | Kruskal's Algorithm |
| Dynamic Programming | Longest Common Subsequence, 0/1 Knapsack |
| Backtracking | N-Queens |

Every algorithm supports **custom input** — your own array, your own graph (as JSON), your own strings, weights/values, or board size — validated and fed straight into the generator.

## Architecture

```
src/
  algorithms/         generator functions — one yield per algorithmic step
    registry.js       single source of truth: pseudocode, complexity, default data, category
  hooks/
    useEngine.js      step-debugger engine: history buffer, play/pause/scrub/jump
  components/
    visualizer/       one visual renderer per data shape (bars, graph, matrix, DP table, board)
    debugger/         CodePanel, CallStack, ComplexityPanel, VariablePanel
    ui/               Sidebar, ControlBar, TraceTape (scrubber), DataInput
  utils/
    graphLayout.js    force-directed layout for arbitrary adjacency lists
```

Adding a 17th algorithm means: write the generator, add one entry to `registry.js`, done — the UI wires itself up automatically.

## Tech stack

- **React 19** + **Vite**
- **Tailwind CSS v4** (CSS-first `@theme` design tokens)
- Plain SVG for graph/diagram rendering (no charting library dependency)
- Zero global state library — a single custom hook (`useEngine`) is the entire state machine

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. To build for production:

```bash
npm run build
```

## Design notes

The visual theme ("Signal") is a dark IDE aesthetic — deep ink backgrounds, a phosphor-green primary accent, and amber/violet/rose/cyan as secondary signal colors for different semantic states (comparing, swapping, visiting, rejecting). The centerpiece interaction is the **trace tape**: a scrubbable timeline along the bottom that treats every algorithm run as a tape of recorded steps, the same mental model as a video editor's timeline or a time-travel debugger.
