import { FSAState } from './FSASearch'
import { GraphStepper } from './Step'
import { ExecutionResult, ExecutionTrace } from './graph'
import { Node } from './interfaces/graph'
import { breadthFirstSearch } from './search'
import { FSAProjectGraph } from 'frontend/src/types/ProjectTypes'
import { buildProblem, findInitialState } from './utils'

const generateTrace = (node: Node<FSAState>): ExecutionTrace[] => {
  const trace: ExecutionTrace[] = []
  while (node.parent) {
    trace.push({
      to: node.state.id,
      read: node.state.read
    })
    node = node.parent
  }
  trace.push({
    to: node.state.id,
    read: null
  })
  return trace.reverse()
}

export const simulateFSA = (
  graph: FSAProjectGraph,
  input: string
): ExecutionResult => {
  // Doing this find here so we don't have to deal with undefined in the class
  if (!findInitialState(graph)) {
    return {
      accepted: false,
      remaining: input,
      trace: []
    }
  }

  const problem = buildProblem(graph, input)
  const result = breadthFirstSearch(problem)

  if (!result) {
    return {
      trace: [{ to: 0, read: null }],
      accepted: false,
      remaining: input
    }
  }

  return {
    accepted: result.state.isFinal && result.state.remaining === '',
    remaining: result.state.remaining,
    trace: generateTrace(result)
  }
}

export const graphStepper = (graph: FSAProjectGraph, input: string) => {
  const problem = buildProblem(graph, input)

  return new GraphStepper(problem)
}
