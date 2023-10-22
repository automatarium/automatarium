import { ProjectGraph } from 'frontend/src/types/ProjectTypes'
import { convertToDAG } from '../src/layouts/utils/convertToDAG'
import hasReflexive from './graphs/convertToDAGHasReflex.json'
import ignoredReflexive from './graphs/convertToDAGIgnoreReflex.json'

/** Same reason as NFA to DFA tests */
type Graph = Omit<ProjectGraph, 'projectType'> & {projectType: string}
const convert = (g: Graph) => convertToDAG(g as ProjectGraph)

describe('Test that DAG conversion is correct', () => {
  const expectDAG = (initial: Graph, result: Graph) => {
    const graph = convert(initial)
    expect(graph.initialState).toEqual(result.initialState)
    expect(graph.states).toEqual(result.states)
    expect(graph.transitions).toEqual(result.transitions)
  }
  test('Reflexive transition is ignored', () => {
    expectDAG(hasReflexive, ignoredReflexive)
  })
})
