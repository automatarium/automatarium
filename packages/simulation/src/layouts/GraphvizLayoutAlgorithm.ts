/**
 * Implements the algorithm described in [this paper](https://www.graphviz.org/documentation/TSE93.pdf)
 * 'A Technique for Drawing Directed Graphs' by Gansner E.R. et. al.
 */
import { Record, Records } from './types'
import { STATE_CIRCLE_RADIUS } from 'frontend/src/config/rendering'
import { ProjectGraph } from 'frontend/src/types/ProjectTypes'

type Edge = [number, number]
type AdjacencyList = Map<number, [number, number][]>
type CyclesCounter = Map<Edge, number>
type DetectCyclesProblem = {
  adjacencyList: AdjacencyList
  states: number[]
  cyclesCounter: CyclesCounter
}

const GraphvizLayoutAlgorithm = (graph: ProjectGraph) => {
  const graphClone = structuredClone(graph)
  const cloneStates = graphClone.states

  // Make graph acyclic
  // Ignore reflexive transitions
  const noReflex = graphClone.transitions.filter(t => !(t.from === t.to))
  // Merge edges and assign weight according to number of transitions
  const edges = new Map<number, [[number, number]]>()
  for (const t of noReflex) {
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

  const getInitialState = (graph: ProjectGraph): number => {
    // Choose source node
    if (graph.initialState) {
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
   * @returns mapping is states with number of cycles associated with it
   * */
  const getStateCycles = (currentState: number, problem: DetectCyclesProblem, visited: number[], frontier: number[]): CyclesCounter => {
    // Base case all states have been traversed and no cycles were found
    if (visited.every(v => problem.states.includes(v))) {
      return problem.cyclesCounter
    }
    const nextAdjList = problem.adjacencyList.get(currentState)
    const nextFrontier = nextAdjList // undefined or a [[number, number]]
      ? [...frontier, ...nextAdjList.map(p => p[0]).sort()]
      : [...frontier]
    const nextVisited = [...visited, currentState]

    let nextState = nextFrontier.shift()
    // Get the next state that won't result in a cycle
    while (visited.includes(nextState)) {
      // Number of times a state will form a cycle is counted
      problem.cyclesCounter.set([currentState, nextState], problem.cyclesCounter.get([currentState, nextState]) + 1)
      // Empty frontier
      if (nextFrontier.length <= 0) {
        return problem.cyclesCounter
      }
      nextState = nextFrontier.shift()
    }
    return getStateCycles(nextState, problem, nextVisited, nextFrontier)
  }

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

  const reverseEdge = (graph: ProjectGraph, edges: AdjacencyList, edge: Edge) => {
    const transitionsToReverse = graph.transitions.filter(t => t.to === edges[0] && t.from === edges[1])
    transitionsToReverse.forEach(t => {
      const tmp = t.to
      t.to = t.from
      t.from = tmp
    })
    const toReverseWeight = edges.get(edge[0]).find(e => e[0] === edge[1])
    // Check if there was a transition from 1 -> 0
    if (edges.has(edge[1])) {
      const otherValue = edges.get(edge[1]).find(e => e[0] === edges[0])
      otherValue[1] = otherValue[1] + toReverseWeight[1]
    } else {
      edges.set(edge[1], [toReverseWeight])
    }
    edges.set(edge[0], edges.get(edge[0]).filter(e => e[0] !== edge[1]))
  }

  const cyclesCounter = new Map<[number, number], number>()
  // Get initial node
  const initialState = getInitialState(graphClone)
  let done = false
  while (!done) {
    // Reset cycles counter
    cloneStates.forEach(from => {
      cloneStates.forEach(to => {
        cyclesCounter.set([from.id, to.id], 0)
      })
    })
    const result = getStateCycles(
      initialState,
      {
        adjacencyList: edges,
        states: graphClone.states.map(s => s.id),
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

  // Size of bounding box of a node
  const nodeB = [STATE_CIRCLE_RADIUS, STATE_CIRCLE_RADIUS]
  // Minimum horizontal separation
  const nodeSep = 5
  // Minimum vertical separation
  const rankSep = 5

  console.log(`${nodeB}, ${nodeSep}, ${rankSep}`)

  const records = {} as Records

  cloneStates.forEach(v => {
    const adjacentStateIds = []
    for (const t of graphClone.transitions) {
      if (t.from === v.id && !adjacentStateIds.includes(t.to)) {
        adjacentStateIds.push(t.to)
      }
      if (t.to === v.id && !adjacentStateIds.includes(t.from)) {
        adjacentStateIds.push(t.from)
      }
    }
    const r = {
      point: { x: v.x, y: v.y },
      omega: 1,
      adjacentList: adjacentStateIds
    } as Record
    records[v.id] = r
  })

  // rank
  // ordering
  // position

  return graphClone
}

export default GraphvizLayoutAlgorithm
