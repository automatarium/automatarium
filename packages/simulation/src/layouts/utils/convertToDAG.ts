import { ProjectGraph } from 'frontend/src/types/ProjectTypes'

/** Edge needs to be a string as a tuple `[f, t]` is passed by reference.
 *  Use `[f, t].join(',')` for the key.
 */
type Edge = string
/** Weighted Adjacency list. Weighting is the original graph's out degree.
 * @key is the transition `from` state id
 * @value is the values [ `to` state id, weighting ]
 */
type AdjacencyList = Map<number, [number, number][]>
/**
 * Mapping of edge to number of cycles counted
 */
type CyclesCounter = Map<Edge, number>
type DetectCyclesProblem = {
  adjacencyList: AdjacencyList
  states: number[]
  cyclesCounter: CyclesCounter
}

export const adjacencyListToTransitions = (graph: ProjectGraph, adjacencyList: AdjacencyList) => {
  const transitions = []
  adjacencyList.forEach((adjList, k) => {
    adjList.forEach(adj => {
      const [from, to] : [number, number] = [k, adj[0]]
      transitions.push(graph.transitions.find(t => t.from === from && t.to === to))
    })
  })
  return transitions
}

// Make graph acyclic
export const convertToDAG = (graph: ProjectGraph) : [ProjectGraph, AdjacencyList] => {
  const graphClone = structuredClone(graph)
  const cloneStates = graphClone.states

  // Merge edges and assign weight according to number of transitions
  const edges = new Map<number, [number, number][]>()
  // Ignore reflexive transitions
  for (const t of graphClone.transitions.filter(t => t.from !== t.to)) {
    if (edges.has(t.from)) {
      if (edges.get(t.from).some(p => p[0] === t.to)) {
        edges.get(t.from).find(p => p[0] === t.to)[1] += 1
      } else {
        edges.get(t.from).push([t.to, 1])
      }
    } else {
      edges.set(t.from, [[t.to, 1]])
    }
  }

  // Collapse edges to first transition
  graphClone.transitions = adjacencyListToTransitions(graphClone, edges)

  /**
   * Priority:
   *  initialState -> finalStates (random) -> random state
   */
  const getInitialState = (graph: ProjectGraph): number => {
    // Choose source node
    if (graph.initialState || graph.initialState === 0) {
      return graph.initialState
    }
    // Choose sink node
    const finalStates = graph.states.filter(s => s.isFinal)
    if (finalStates) {
      // Choose a random sink
      const choice = Math.floor(Math.random() * finalStates.length)
      return finalStates[choice].id
    }
    // Choose random state
    const choice = Math.floor(Math.random() * graph.states.length)
    return graph.states[choice].id
  }

  /**
   * Perform depth-first traversal
   * @returns mapping with states to number of cycles associated with it
   * */
  const getStateCycles = (currentState: number, problem: DetectCyclesProblem, visited: number[], frontier: number[]): CyclesCounter => {
    // Base case all states have been traversed and no cycles were found
    if (visited.length > 0 && problem.states.every(v => visited.includes(v))) {
      return problem.cyclesCounter
    }
    const nextVisited = [...visited, currentState]
    const nextAdjList = problem.adjacencyList.get(currentState)
    // Add all adjacent states not in visited
    const frontierAdditions = []
    if (nextAdjList) {
      nextAdjList.forEach(p => {
        const id = p[0]
        if (nextVisited.includes(id)) {
          // If visited then is a cycle
          const edgeKey = [currentState, id].join(',')
          problem.cyclesCounter.set(edgeKey, problem.cyclesCounter.get(edgeKey) + 1)
        }
        frontierAdditions.push(id)
      })
    }
    const nextFrontier = [...frontier, ...frontierAdditions.sort()]
    const nextState = nextFrontier.shift()
    return getStateCycles(nextState, problem, nextVisited, nextFrontier)
  }

  /** Get the Edge with the highest cycle */
  const getMaximalCycler = (cyclesCounter: CyclesCounter): Edge | null => {
    const maxPair = [null, 0] as [Edge, number]
    for (const pair of cyclesCounter.entries()) {
      if (pair[1] > maxPair[1]) {
        maxPair[0] = pair[0]
        maxPair[1] = pair[1]
      }
    }
    return maxPair[0]
  }

  /** Reverse all transitions in the directed edge then updates the adjacency list. */
  const reverseEdge = (edges: AdjacencyList, edgeKey: Edge) => {
    // Update adjacency list
    const edge = edgeKey.split(',').map(v => parseInt(v))
    const toReverseWeight = structuredClone(edges.get(edge[0]).find(e => e[0] === edge[1]))
    toReverseWeight[0] = edge[0]
    // Check if there was a transition from 1 -> 0
    if (edges.has(edge[1])) {
      const otherValue = edges.get(edge[1]).find(e => e[0] === edge[0])
      if (otherValue) {
        otherValue[1] = otherValue[1] + toReverseWeight[1]
      } else {
        edges.set(edge[1], [...edges.get(edge[1]), toReverseWeight])
      }
    } else {
      edges.set(edge[1], [toReverseWeight])
    }
    // Filter out the removed value
    const newAdjacents = edges.get(edge[0]).filter(e => e[0] !== edge[1])
    if (newAdjacents.length > 0) {
      edges.set(edge[0], newAdjacents)
    } else {
      // Delete edge if there's no more
      edges.delete(edge[0])
    }
  }

  const cyclesCounter = new Map<string, number>()
  const initialState = getInitialState(graphClone)
  const stateIds = graphClone.states.map(s => s.id)
  // Repeat until all cycles are resolved
  let done = false
  while (!done) {
    // Reset cycles counter
    cloneStates.forEach(from => {
      cloneStates.forEach(to => {
        if (from !== to) cyclesCounter.set([from.id, to.id].join(','), 0)
      })
    })
    const result = getStateCycles(
      initialState,
      {
        adjacencyList: edges,
        states: stateIds,
        cyclesCounter
      },
      [],
      []
    )
    const maximalCycler = getMaximalCycler(result)
    if (!maximalCycler) {
      // Maximal is null
      done = true
    } else {
      reverseEdge(edges, maximalCycler)
    }
  }

  // Update result
  graphClone.transitions = adjacencyListToTransitions(graphClone, edges)

  return [graphClone, edges]
}
