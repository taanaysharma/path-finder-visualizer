// Central registry: every algorithm's metadata, default dataset, pseudocode
// (for the synced Code Panel), and complexity facts (for the Complexity Panel).
// Adding a new algorithm to the app means adding one entry here.

export const CATEGORIES = {
  sorting: { label: 'Sorting', color: 'var(--color-signal-500)' },
  searching: { label: 'Searching', color: 'var(--color-cyan-signal-500)' },
  graph: { label: 'Graph Traversal', color: 'var(--color-amber-signal-500)' },
  shortestPath: { label: 'Shortest Path', color: 'var(--color-amber-signal-500)' },
  mst: { label: 'Minimum Spanning Tree', color: 'var(--color-violet-signal-500)' },
  dp: { label: 'Dynamic Programming', color: 'var(--color-rose-signal-500)' },
  backtracking: { label: 'Backtracking', color: 'var(--color-violet-signal-500)' },
};

export const ALGORITHMS = {
  bubbleSort: {
    label: 'Bubble Sort',
    category: 'sorting',
    visualizer: 'array',
    dataShape: 'array',
    defaultData: { array: [38, 27, 43, 3, 9, 82, 10, 19, 50, 12] },
    complexity: { time: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: true, inPlace: true },
    summary: 'Repeatedly swaps adjacent out-of-order elements, "bubbling" the largest unsorted value to the end each pass.',
    pseudocode: [
      'for i in 0..n-1:',
      '  for j in 0..n-i-2:',
      '    if arr[j] > arr[j+1]:',
      '      swap(arr[j], arr[j+1])',
      'return arr',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'compare') return 2;
      if (s.type === 'swap') return 3;
      if (s.type === 'locked') return 1;
      if (s.type === 'done') return 4;
      return 1;
    },
  },

  insertionSort: {
    label: 'Insertion Sort',
    category: 'sorting',
    visualizer: 'array',
    dataShape: 'array',
    defaultData: { array: [38, 27, 43, 3, 9, 82, 10, 19, 50, 12] },
    complexity: { time: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: true, inPlace: true },
    summary: 'Builds the sorted array one element at a time, inserting each new key into its correct position among the already-sorted prefix.',
    pseudocode: [
      'for i in 1..n-1:',
      '  key = arr[i]; j = i - 1',
      '  while j >= 0 and arr[j] > key:',
      '    arr[j+1] = arr[j]; j -= 1',
      '  arr[j+1] = key',
      'return arr',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'pick_key') return 1;
      if (s.type === 'compare') return 2;
      if (s.type === 'shift') return 3;
      if (s.type === 'insert') return 4;
      if (s.type === 'done') return 5;
      return 0;
    },
  },

  heapSort: {
    label: 'Heap Sort',
    category: 'sorting',
    visualizer: 'array',
    dataShape: 'array',
    defaultData: { array: [38, 27, 43, 3, 9, 82, 10, 19, 50, 12] },
    complexity: { time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(1)', stable: false, inPlace: true },
    summary: 'Builds a max-heap, then repeatedly extracts the maximum to the end of the array and re-heapifies the remainder.',
    pseudocode: [
      'buildMaxHeap(arr)',
      'for end in n-1..1:',
      '  swap(arr[0], arr[end])',
      '  heapify(arr, end, 0)',
      'return arr',
      '',
      'heapify(arr, size, root):',
      '  largest = max(root, left, right)',
      '  if largest != root: swap; heapify(largest)',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'heap_built') return 1;
      if (s.type === 'extract') return 2;
      if (s.type === 'heapify_start') return 3;
      if (s.type === 'compare') return 7;
      if (s.type === 'swap') return 8;
      if (s.type === 'done') return 4;
      return 3;
    },
  },

  mergeSort: {
    label: 'Merge Sort',
    category: 'sorting',
    visualizer: 'array',
    dataShape: 'array',
    defaultData: { array: [38, 27, 43, 3, 9, 82, 10, 19, 50, 12] },
    complexity: { time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)', stable: true, inPlace: false },
    summary: 'Divides the array in half recursively, then merges sorted halves back together in linear time.',
    pseudocode: [
      'mergeSort(arr, l, r):',
      '  if l >= r: return',
      '  mid = (l + r) / 2',
      '  mergeSort(arr, l, mid)',
      '  mergeSort(arr, mid+1, r)',
      '  merge(arr, l, mid, r)',
    ],
    lineForStep: () => 0,
  },

  quickSort: {
    label: 'Quick Sort',
    category: 'sorting',
    visualizer: 'quickSort',
    dataShape: 'array',
    defaultData: { array: [38, 27, 43, 3, 9, 82, 10, 19, 50, 12] },
    complexity: { time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n)', stable: false, inPlace: true },
    summary: 'Picks a pivot, partitions the array around it, then recursively sorts each side.',
    pseudocode: [
      'quickSort(arr, low, high):',
      '  if low < high:',
      '    p = partition(arr, low, high)',
      '    quickSort(arr, low, p-1)',
      '    quickSort(arr, p+1, high)',
      '',
      'partition(arr, low, high):',
      '  pivot = arr[high]',
      '  for j in low..high-1:',
      '    if arr[j] < pivot: swap & i++',
      '  swap(arr[i+1], arr[high])',
    ],
    lineForStep: (s) => {
      if (s.type === 'compare') return 9;
      if (s.type === 'swap') return 10;
      if (s.type === 'pivot_select') return 7;
      return 8;
    },
  },

  binarySearch: {
    label: 'Binary Search',
    category: 'searching',
    visualizer: 'array',
    dataShape: 'arrayWithTarget',
    defaultData: { array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 23 },
    complexity: { time: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' }, space: 'O(1)', stable: null, inPlace: true },
    summary: 'Repeatedly halves a sorted search space by comparing the middle element to the target.',
    pseudocode: [
      'left, right = 0, n - 1',
      'while left <= right:',
      '  mid = (left + right) / 2',
      '  if arr[mid] == target: return mid',
      '  elif arr[mid] < target: left = mid + 1',
      '  else: right = mid - 1',
      'return -1',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'calculating_mid') return 3;
      if (s.type === 'found') return 3;
      if (s.type === 'update_left') return 4;
      if (s.type === 'update_right') return 5;
      if (s.type === 'not_found') return 6;
      return 1;
    },
  },

  bfs: {
    label: 'Breadth-First Search',
    category: 'graph',
    visualizer: 'graph',
    dataShape: 'graph',
    needsStartNode: true,
    defaultData: {
      graph: { A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F'], D: ['B'], E: ['B'], F: ['C'] },
      startNode: 'A',
    },
    complexity: { time: { best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)', stable: null, inPlace: false },
    summary: 'Explores the graph level by level using a FIFO queue, guaranteeing shortest paths in unweighted graphs.',
    pseudocode: [
      'queue = [start]; visited = {start}',
      'while queue not empty:',
      '  node = queue.dequeue()',
      '  for neighbor in graph[node]:',
      '    if neighbor not visited:',
      '      visited.add(neighbor)',
      '      queue.enqueue(neighbor)',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'visiting') return 2;
      if (s.type === 'checking_neighbor' || s.type === 'skipping_neighbor') return 3;
      if (s.type === 'adding_neighbor') return 6;
      if (s.type === 'done') return 1;
      return 1;
    },
  },

  dfs: {
    label: 'Depth-First Search',
    category: 'graph',
    visualizer: 'graph',
    dataShape: 'graph',
    needsStartNode: true,
    defaultData: {
      graph: { A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F'], D: ['B'], E: ['B'], F: ['C'] },
      startNode: 'A',
    },
    complexity: { time: { best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)', stable: null, inPlace: false },
    summary: 'Explores as far as possible along each branch using recursion (a stack) before backtracking.',
    pseudocode: [
      'dfs(node, visited):',
      '  visited.add(node)',
      '  for neighbor in graph[node]:',
      '    if neighbor not visited:',
      '      dfs(neighbor, visited)',
    ],
    lineForStep: (s) => {
      if (s.type === 'visiting') return 1;
      if (s.type === 'checking_neighbor' || s.type === 'skipping_neighbor') return 2;
      if (s.type === 'backtracking') return 4;
      return 0;
    },
  },

  dijkstra: {
    label: "Dijkstra's Algorithm",
    category: 'shortestPath',
    visualizer: 'graph',
    dataShape: 'weightedGraph',
    needsStartNode: true,
    defaultData: {
      graph: { A: { B: 4, C: 2 }, B: { A: 4, D: 3, E: 1 }, C: { A: 2, F: 5 }, D: { B: 3 }, E: { B: 1 }, F: { C: 5 } },
      startNode: 'A',
    },
    complexity: { time: { best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(E log V)' }, space: 'O(V)', stable: null, inPlace: false },
    summary: 'Greedily expands the closest unvisited node using a priority queue, relaxing edge distances as it goes. Requires non-negative weights.',
    pseudocode: [
      'dist[start] = 0; pq = {start}',
      'while pq not empty:',
      '  u = pq.extractMin()',
      '  for (v, w) in graph[u]:',
      '    if dist[u] + w < dist[v]:',
      '      dist[v] = dist[u] + w',
      '      pq.insert(v, dist[v])',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'visiting') return 2;
      if (s.type === 'checking_neighbor') return 3;
      if (s.type === 'updating_distance') return 5;
      return 1;
    },
  },

  astar: {
    label: 'A* Search',
    category: 'shortestPath',
    visualizer: 'graph',
    dataShape: 'weightedGraphWithGoal',
    defaultData: {
      graph: { A: { B: 4, C: 2 }, B: { A: 4, D: 3, E: 1 }, C: { A: 2, F: 5 }, D: { B: 3 }, E: { B: 1 }, F: { C: 5 } },
      startNode: 'A',
      goalNode: 'F',
    },
    complexity: { time: { best: 'O(E)', avg: 'O(E log V)', worst: 'O(E log V)' }, space: 'O(V)', stable: null, inPlace: false },
    summary: "Like Dijkstra's, but uses a heuristic estimate (f = g + h) to prioritize nodes likely to be on the path to the goal.",
    pseudocode: [
      'g[start] = 0; f[start] = h(start)',
      'open = {start}',
      'while open not empty:',
      '  u = node in open with min f',
      '  if u == goal: return path',
      '  for (v, w) in graph[u]:',
      '    tentative_g = g[u] + w',
      '    if tentative_g < g[v]:',
      '      g[v] = tentative_g',
      '      f[v] = g[v] + h(v)',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 1;
      if (s.type === 'visiting') return 3;
      if (s.type === 'done') return 4;
      if (s.type === 'checking_neighbor') return 5;
      if (s.type === 'updating_distance') return 9;
      return 2;
    },
  },

  kruskal: {
    label: "Kruskal's MST",
    category: 'mst',
    visualizer: 'graph',
    dataShape: 'weightedGraph',
    defaultData: {
      graph: { A: { B: 4, C: 2 }, B: { A: 4, D: 3, E: 1 }, C: { A: 2, F: 5 }, D: { B: 3 }, E: { B: 1 }, F: { C: 5 } },
    },
    complexity: { time: { best: 'O(E log E)', avg: 'O(E log E)', worst: 'O(E log E)' }, space: 'O(V)', stable: null, inPlace: false },
    summary: 'Sorts all edges by weight, then greedily adds each edge that connects two different components (using Union-Find) until a spanning tree is formed.',
    pseudocode: [
      'edges.sortByWeight()',
      'for (u, v, w) in edges:',
      '  if find(u) != find(v):',
      '    union(u, v)',
      '    mst.add((u, v, w))',
      'return mst',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'evaluating') return 2;
      if (s.type === 'accept') return 4;
      if (s.type === 'reject') return 2;
      return 1;
    },
  },

  bellmanFord: {
    label: 'Bellman-Ford',
    category: 'shortestPath',
    visualizer: 'graph',
    dataShape: 'weightedGraph',
    needsStartNode: true,
    defaultData: {
      graph: { A: { B: 4, C: 2 }, B: { D: 3, E: 1 }, C: { B: 1, F: 5 }, D: { F: 2 }, E: { D: -2, F: 3 }, F: {} },
      startNode: 'A',
    },
    complexity: { time: { best: 'O(VE)', avg: 'O(VE)', worst: 'O(VE)' }, space: 'O(V)', stable: null, inPlace: false },
    summary: 'Relaxes every edge V−1 times. Slower than Dijkstra, but correctly handles negative edge weights and can detect negative cycles.',
    pseudocode: [
      'dist[start] = 0; others = ∞',
      'repeat V-1 times:',
      '  for (u, v, w) in edges:',
      '    if dist[u] + w < dist[v]:',
      '      dist[v] = dist[u] + w',
      'for (u, v, w) in edges:',
      '  if dist[u] + w < dist[v]:',
      '    report negative cycle',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'pass_start') return 1;
      if (s.type === 'checking_neighbor') return 3;
      if (s.type === 'updating_distance') return 4;
      if (s.type === 'negative_cycle') return 7;
      if (s.type === 'early_stop') return 1;
      return 2;
    },
  },

  floydWarshall: {
    label: 'Floyd-Warshall',
    category: 'shortestPath',
    visualizer: 'matrix',
    dataShape: 'weightedGraph',
    defaultData: {
      graph: { A: { B: 3, C: 8 }, B: { A: 3, D: 1 }, C: { A: 8, D: 2 }, D: { B: 1, C: 2 } },
    },
    complexity: { time: { best: 'O(V³)', avg: 'O(V³)', worst: 'O(V³)' }, space: 'O(V²)', stable: null, inPlace: false },
    summary: 'Computes all-pairs shortest paths by considering every node as a potential intermediate stop, three nested loops over the distance matrix.',
    pseudocode: [
      'for k in nodes:',
      '  for i in nodes:',
      '    for j in nodes:',
      '      if dist[i][k]+dist[k][j] < dist[i][j]:',
      '        dist[i][j] = dist[i][k]+dist[k][j]',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'pivot') return 0;
      if (s.type === 'compare') return 3;
      if (s.type === 'update') return 4;
      return 2;
    },
  },

  lcs: {
    label: 'Longest Common Subsequence',
    category: 'dp',
    visualizer: 'dpTable',
    dataShape: 'twoStrings',
    defaultData: { str1: 'ABCBDAB', str2: 'BDCABA' },
    complexity: { time: { best: 'O(mn)', avg: 'O(mn)', worst: 'O(mn)' }, space: 'O(mn)', stable: null, inPlace: false },
    summary: 'Bottom-up DP where dp[i][j] is the LCS length of the first i and j characters of each string — match extends diagonally, mismatch takes the max of skipping a character from either string.',
    pseudocode: [
      'for i in 1..m:',
      '  for j in 1..n:',
      '    if s1[i-1] == s2[j-1]:',
      '      dp[i][j] = dp[i-1][j-1] + 1',
      '    else:',
      '      dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
      'backtrack from dp[m][n]',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'compare') return 1;
      if (s.type === 'match') return 3;
      if (s.type === 'no_match') return 5;
      if (s.type === 'backtrack') return 6;
      return 2;
    },
  },

  knapsack: {
    label: '0/1 Knapsack',
    category: 'dp',
    visualizer: 'dpTable',
    dataShape: 'knapsack',
    defaultData: { weights: [2, 3, 4, 5], values: [3, 4, 5, 6], capacity: 8 },
    complexity: { time: { best: 'O(nW)', avg: 'O(nW)', worst: 'O(nW)' }, space: 'O(nW)', stable: null, inPlace: false },
    summary: 'For each item and each capacity, decides between including the item (if it fits) or excluding it — dp[i][w] holds the best achievable value.',
    pseudocode: [
      'for i in 1..n:',
      '  for w in 0..W:',
      '    if weight[i] > w:',
      '      dp[i][w] = dp[i-1][w]',
      '    else:',
      '      dp[i][w] = max(',
      '        dp[i-1][w],',
      '        value[i] + dp[i-1][w-weight[i]])',
    ],
    lineForStep: (s) => {
      if (s.type === 'start') return 0;
      if (s.type === 'item_start') return 1;
      if (s.type === 'too_heavy') return 3;
      if (s.type === 'compare') return 5;
      if (s.type === 'include' || s.type === 'exclude') return 7;
      return 4;
    },
  },

  nQueens: {
    label: 'N-Queens',
    category: 'backtracking',
    visualizer: 'board',
    dataShape: 'n',
    defaultData: { n: 5 },
    complexity: { time: { best: 'O(N!)', avg: 'O(N!)', worst: 'O(N!)' }, space: 'O(N)', stable: null, inPlace: false },
    summary: 'Places queens row by row; whenever a placement conflicts with an existing queen, the algorithm backtracks and tries the next column.',
    pseudocode: [
      'solve(row):',
      '  if row == n: record solution; return',
      '  for col in 0..n-1:',
      '    if isSafe(row, col):',
      '      place(row, col)',
      '      solve(row + 1)',
      '      remove(row, col)  // backtrack',
    ],
    lineForStep: (s) => {
      if (s.type === 'trying') return 3;
      if (s.type === 'place') return 4;
      if (s.type === 'conflict') return 3;
      if (s.type === 'backtrack') return 6;
      if (s.type === 'solution_found') return 1;
      return 0;
    },
  },
};

export const CATEGORY_ORDER = ['sorting', 'searching', 'graph', 'shortestPath', 'mst', 'dp', 'backtracking'];
