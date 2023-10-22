import { ProjectGraph } from 'frontend/src/types/ProjectTypes'
import { convertToDAG } from '../src/layouts/utils/convertToDAG'

import ignoreReflex from './graphs/convertToDAGIgnoreReflex.json'
import mergeEdge from './graphs/convertToDAGMergeEdge.json'
import simpleCycleResolution from './graphs/convertToDAGCycleResolved.json'
import twoCycles from './graphs/convertToDAGTwoCycles.json'

import simpleSolution from './graphs/convertToDAGSimpleSolution.json'
import twoCyclesSolution from './graphs/convertToDAGTwoCyclesSolution.json'

/** Same reason as NFA to DFA tests */
type Graph = Omit<ProjectGraph, 'projectType'> & {projectType: string}
const convert = (g: Graph) => convertToDAG(g as ProjectGraph)[0]

describe('Test that DAG conversion is correct', () => {
  const expectDAG = (initial: Graph, result: Graph) => {
    const graph = convert(initial)
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
    expectDAG(simpleCycleResolution, simpleSolution)
  })
  test('Test two simple cycles are resolved correctly', () => {
    expectDAG(twoCycles, twoCyclesSolution)
  })
})
