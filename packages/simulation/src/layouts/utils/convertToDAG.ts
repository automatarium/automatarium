import { BaseAutomataTransition, ProjectGraph } from 'frontend/src/types/ProjectTypes'

/**
 * Edge needs to be a string as a tuple `[f, t]` is passed by reference.
 * Use `[f, t].join(',')` for the key.
 */
type Edge = string
type AdjacentWeight = { id: number, weight: number }
/**
 * Weighted Adjacency list. Weighting is the original graph's out degree.
 * @param key the transition `from` state id
 * @param value the values [ `to` state id, weighting ]
 */
export type AdjacencyList = Map<number, AdjacentWeight[]>
/**
 * Mapping of edge to number of cycles counted
 */
type CyclesCounter = Map<Edge, number>
/**
 * Problem information for detecting and counting cycles
 */
type DetectCyclesProblem = {
  adjacencyList: AdjacencyList
  states: number[]
  cyclesCounter: CyclesCounter
}

/**
 * Takes an adjacency list and returns it as a list of transitions
 * @param graph In progress graph to get the read and id values from
 * @param adjacencyList Weighted adjacency list @see AdjacencyList
 */
export const adjacencyListToTransitions = (graph: ProjectGraph, adjacencyList: AdjacencyList) => {
  const transitions = <BaseAutomataTransition[]>[]
  adjacencyList.forEach((adjList, k) => {
    adjList.forEach(adj => {
      const [from, to] : [number, number] = [k, adj.id]
      transitions.push(graph.transitions.find(t => t.from === from && t.to === to))
    })
  })
  return transitions.sort((a, b) => a.id - b.id)
}

// Make graph acyclic
export const convertToDAG = (graph: ProjectGraph) : [ProjectGraph, AdjacencyList] => {
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
    const nextVisited = visited.includes(currentState)
      ? [...visited]
      : [...visited, currentState]

    const nextAdjList = problem.adjacencyList.get(currentState)
    // Add all adjacent states not in visited
    const frontierAdditions = []
    if (nextAdjList) {
      nextAdjList.forEach(p => {
        const id = p.id
        if (nextVisited.includes(id)) {
          // If visited then is a cycle
          const edgeKey = [currentState, id].join(',')
          problem.cyclesCounter.set(edgeKey, problem.cyclesCounter.get(edgeKey) + 1)
        } else {
          frontierAdditions.push(id)
        }
      })
    }
    const nextFrontier = [...frontier, ...frontierAdditions]
    if (nextFrontier.length < 1) {
      return problem.cyclesCounter
    }
    const nextState = nextFrontier.pop()
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
  const reverseEdge = (graph: ProjectGraph, edges: AdjacencyList, edgeKey: Edge) => {
    const [from, to] = edgeKey.split(',').map(v => parseInt(v))
    const transitionsToReverse = graph.transitions.filter(t => t.to === to && t.from === from)
    const transitionsNotToReverse = graph.transitions.filter(t => t.to !== to || t.from !== from)
    transitionsToReverse.forEach(t => {
      const tmp = t.to
      t.to = t.from
      t.from = tmp
    })
    graph.transitions = [...transitionsToReverse, ...transitionsNotToReverse]
    // Update adjacency list
    const toReverseWeight = structuredClone(edges.get(from).find(e => e.id === to))
    toReverseWeight.id = from
    // Check if there was a transition from 1 -> 0
    if (edges.has(to)) {
      const otherValue = edges.get(to).find(e => e.id === from)
      if (otherValue) {
        otherValue.weight = otherValue.weight + toReverseWeight.weight
      } else {
        edges.set(to, [...edges.get(to), toReverseWeight])
      }
    } else {
      edges.set(to, [toReverseWeight])
    }
    // Filter out the removed value
    const newAdjacents = edges.get(from).filter(e => e.id !== to)
    if (newAdjacents.length > 0) {
      edges.set(from, newAdjacents)
    } else {
      // Delete edge if there's no more
      edges.delete(from)
    }
  }

  /** Start actual code */
  // We don't want to edit the original graph reference as we are just rearranging
  const graphClone = structuredClone(graph)
  const cloneStates = graphClone.states

  // Merge edges and assign weight according to number of transitions
  const edges = new Map<number, AdjacentWeight[]>()
  // Ignore reflexive transitions
  for (const t of graphClone.transitions.filter(t => t.from !== t.to)) {
    if (edges.has(t.from)) {
      if (edges.get(t.from).some(p => p.id === t.to)) {
        edges.get(t.from).find(p => p.id === t.to).weight += 1
      } else {
        edges.get(t.from).push({ id: t.to, weight: 1 })
      }
    } else {
      edges.set(t.from, [{ id: t.to, weight: 1 }])
    }
  }

  // Collapse edges to first transition
  graphClone.transitions = adjacencyListToTransitions(graphClone, edges)

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
      reverseEdge(graphClone, edges, maximalCycler)
    }
  }

  // Update result
  graphClone.transitions = adjacencyListToTransitions(graphClone, edges)

  return [graphClone, edges]
}
