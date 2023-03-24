import { TMState, TMGraph } from './TMSearch'
import {
  TMGraphIn,
  Tape,
  TMExecutionResult,
  TMExecutionTrace
} from './graph'
import { Node } from './interfaces/graph'
import { breadthFirstSearch } from './search'

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
  graphIn: TMGraphIn,
  // This forces front end to through a tape
  inputTapeIn: Tape
): TMExecutionResult => {
  const inputTape = structuredClone(inputTapeIn)
  const graph = structuredClone(graphIn)
  const initialState = graph.states.find((state) => {
    return state.id === graph.initialState
  })

  if (!initialState) {
    return {
      halted: false,
      tape: inputTape,
      trace: []
    }
  }

  initialState.tape = inputTape

  const initialNode = new Node<TMState>(new TMState(initialState.id, initialState.isFinal, initialState.tape))

  const problem = new TMGraph(initialNode, graph.states, graph.transitions)
  const result = breadthFirstSearch(problem)

  if (!result) {
    const emptyExecution: TMExecutionResult = {
      trace: [{ to: 0, tape: null }],
      halted: false,
      tape: inputTape
    }
    return emptyExecution
  }
  return {
    halted: result.state.isFinal,
    tape: result.state.tape,
    trace: generateTrace(result)
  }
}
