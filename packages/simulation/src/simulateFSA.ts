import { FSAState } from './FSASearch'
import { ExecutionResult, ExecutionTrace } from './graph'
import { Node } from './interfaces/graph'
import { breadthFirstSearch } from './search'
import { FSAProjectGraph } from 'frontend/src/types/ProjectTypes'
import { buildProblem } from './utils'

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
  const problem = buildProblem(graph, input)
  if (!problem) {
    return {
      accepted: false,
      remaining: input,
      trace: []
    }
  }

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
