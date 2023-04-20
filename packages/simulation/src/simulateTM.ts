import { TMGraph, TMState } from './TMSearch'
import { TMExecutionResult, TMExecutionTrace } from './graph'
import { Node } from './interfaces/graph'
import { breadthFirstSearch } from './search'
import { newTape } from './utils'
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
  graphIn: TMProjectGraph,
  // This forces front end to through a tape
  input: string
): TMExecutionResult => {
  const inputTape = newTape(input)
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

  const initialNode = new Node<TMState>(new TMState(initialState.id, initialState.isFinal))

  initialNode.state.tape = inputTape

  const problem = new TMGraph(initialNode, graph.states.map(s => new TMState(s.id, s.isFinal)), graph.transitions)
  const result = breadthFirstSearch(problem)

  if (!result) {
    return {
      trace: [{ to: 0, tape: null }],
      halted: false,
      tape: inputTape
    }
  }
  return {
    halted: result.state.isFinal,
    tape: result.state.tape,
    trace: generateTrace(result)
  }
}
