import { TMGraph, TMState } from './TMSearch'
import { TMExecutionResult, TMExecutionTrace } from './graph'
import { Node } from './interfaces/graph'
import { breadthFirstSearch } from './search'
import { buildProblem, newTape } from './utils'
import { TMProjectGraph } from 'frontend/src/types/ProjectTypes'

const generateTrace = (node: Node<TMState>): TMExecutionTrace[] => {
  const trace: TMExecutionTrace[] = []
  while (node.parent) {
    trace.push({
      to: node.state.id,
      tape: node.state.tape
    })
    node = node.parent
  }
  trace.push({
    to: node.state.id,
    tape: node.state.tape
  })
  return trace.reverse()
}

export const simulateTM = (
  graph: TMProjectGraph,
  input: string
): TMExecutionResult => {
  const problem = buildProblem(graph, input) as TMGraph
  if (!problem) {
    return {
      accepted: false,
      tape: newTape(input),
      trace: []
    }
  }
  const result = breadthFirstSearch(problem)

  if (!result) {
    return {
      trace: [{ to: 0, tape: null }],
      accepted: false,
      tape: newTape(input)
    }
  }
  return {
    accepted: result.state.isFinal,
    tape: result.state.tape,
    trace: generateTrace(result)
  }
}
