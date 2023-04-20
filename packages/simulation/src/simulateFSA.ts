import { FSAGraph, FSAState } from './FSASearch'
import { GraphStepper } from './Step'
import { ExecutionResult, ExecutionTrace } from './graph'
import { Node } from './interfaces/graph'
import { breadthFirstSearch } from './search'
import { FSAProjectGraph } from 'frontend/src/types/ProjectTypes'
import { buildProblem, expandTransitions, findInitialState } from './utils'

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
  const initialState = findInitialState(graph)

  if (!initialState) {
    return {
      accepted: false,
      remaining: input,
      trace: []
    }
  }

  const initialNode = new Node<FSAState>(
    new FSAState(initialState.id, initialState.isFinal, null, input)
  )

  const states = graph.states.map(
    (state) => new FSAState(state.id, state.isFinal)
  )

  const problem = new FSAGraph(
    initialNode,
    states,
    // We need to expand the read symbols in the transitions
    expandTransitions(graph.transitions)
  )
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
