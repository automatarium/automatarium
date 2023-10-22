import { ProjectGraph } from 'frontend/src/types/ProjectTypes'
import { convertToDAG } from '../src/layouts/utils/convertToDAG'

import ignoreReflex from './graphs/convertToDAGIgnoreReflex.json'
import mergeEdge from './graphs/convertToDAGMergeEdge.json'
import simpleCycleResolution from './graphs/convertToDAGCycleResolved.json'
import twoCycles from './graphs/convertToDAGTwoCycles.json'
import triangle from './graphs/convertToDAGTriangle.json'
import simpleFuture from './graphs/convertToDAGFutureCycle.json'

import simpleSolution from './graphs/convertToDAGSimpleSolution.json'
import simpleCycleSolution from './graphs/convertToDAGCycleResolveSolution.json'
import twoCyclesSolution from './graphs/convertToDAGTwoCyclesSolution.json'
import triangleSolution from './graphs/convertToDAGTriangleSolution.json'
import simpleFutureSolution from './graphs/convertToDAGFutureCycleSolution.json'

/** Same reason as NFA to DFA tests */
type Graph = Omit<ProjectGraph, 'projectType'> & {projectType: string}
const convert = (g: Graph) => convertToDAG(g as ProjectGraph)[0]

/** I suspect some nodes may become unreachable but this doesn't check for that.
 *  It will cost a lot to check for cycles within enclaves etc.
 */
const hasCycles = (graph: ProjectGraph) : boolean => {
  const getInitial = (graph: ProjectGraph) : number => {
    if (graph.initialState) return graph.initialState
    // let's start from zero!
    let sStartFromZero = 0
    while (!graph.transitions.some(t => t.id === sStartFromZero)) {
      sStartFromZero += 1
    }
    return sStartFromZero
  }

  const buildAdjacencyList = (graph: ProjectGraph) : Map<number, number[]> => {
    const adjList = new Map<number, number[]>()
    graph.transitions.forEach(t => {
      if (adjList.has(t.from)) {
        adjList.get(t.from).push(t.to)
      } else {
        adjList.set(t.from, [t.to])
      }
    })
    return adjList
  }

  const adjList = buildAdjacencyList(graph)

  const initialState = getInitial(graph)
  const visited = []
  const frontier = []
  frontier.push(initialState)

  while (frontier.length > 0) {
    const current = frontier.pop()
    const successors = adjList.get(current) ?? []
    successors.forEach(s => {
      if (visited.includes(s)) {
        return true
      }
      if (!frontier.includes(s)) {
        frontier.push(s)
      }
    })
    visited.push(current)
  }
  return false
}

describe('Test that DAG conversion is correct', () => {
  const expectDAG = (initial: Graph, result: Graph) => {
    const graph = convert(initial)
    expect(hasCycles(graph)).toBeFalse()
    expect(graph.initialState).toEqual(result.initialState)
    expect(graph.states).toEqual(result.states)
    expect(graph.transitions).toEqual(result.transitions)
  }

  test('Reflexive transition is ignored', () => {
    expectDAG(ignoreReflex, simpleSolution)
  })
  test('Test edges are merged to single transition', () => {
    expectDAG(mergeEdge, simpleSolution)
  })
  test('Test that a single cycle is resolved', () => {
    expectDAG(simpleCycleResolution, simpleCycleSolution)
  })
  test('Test two simple cycles are resolved correctly', () => {
    expectDAG(twoCycles, twoCyclesSolution)
  })
  test('Test more complex cycle resolution', () => {
    expectDAG(triangle, triangleSolution)
  })
  test('Test cycle resolution on long cycle', () => {
    expectDAG(simpleFuture, simpleFutureSolution)
  })
})
