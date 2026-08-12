import {
  FSAProjectGraph,
  PDAProjectGraph,
  TMProjectGraph
} from 'frontend/src/types/ProjectTypes'
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

type AutomataProjectGraph = FSAProjectGraph | PDAProjectGraph | TMProjectGraph
type Graph = Omit<AutomataProjectGraph, 'projectType'> & { projectType: string }

const convert = (g: Graph) => convertToDAG(g as AutomataProjectGraph)[0]

const hasCycles = (graph: AutomataProjectGraph): boolean => {
  const adjList = new Map<number, number[]>()

  graph.transitions.forEach(t => {
    if (!adjList.has(t.from)) {
      adjList.set(t.from, [])
    }

    adjList.get(t.from)?.push(t.to)
  })

  const visited = new Set<number>()
  const recursionStack = new Set<number>()

  const visit = (stateId: number): boolean => {
    if (recursionStack.has(stateId)) {
      return true
    }

    if (visited.has(stateId)) {
      return false
    }

    visited.add(stateId)
    recursionStack.add(stateId)

    const successors = adjList.get(stateId) ?? []

    for (const successor of successors) {
      if (visit(successor)) {
        return true
      }
    }

    recursionStack.delete(stateId)

    return false
  }

  for (const state of graph.states) {
    if (visit(state.id)) {
      return true
    }
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
    expectDAG(ignoreReflex as Graph, simpleSolution as Graph)
  })

  test('Test edges are merged to single transition', () => {
    expectDAG(mergeEdge as Graph, simpleSolution as Graph)
  })

  test('Test that a single cycle is resolved', () => {
    expectDAG(simpleCycleResolution as Graph, simpleCycleSolution as Graph)
  })

  test('Test two simple cycles are resolved correctly', () => {
    expectDAG(twoCycles as Graph, twoCyclesSolution as Graph)
  })

  test('Test more complex cycle resolution', () => {
    expectDAG(triangle as Graph, triangleSolution as Graph)
  })

  test('Test cycle resolution on long cycle', () => {
    expectDAG(simpleFuture as Graph, simpleFutureSolution as Graph)
  })
})