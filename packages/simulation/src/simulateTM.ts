import { TMGraph, TMState } from './TMSearch'
import { TMExecutionResult, TMExecutionTrace } from './graph'
import { Node } from './interfaces/graph'
import { breadthFirstSearch, breadthFirstSearchNoPause } from './search'
import { buildProblem, newTape } from './utils'
import { TMProjectGraph } from 'frontend/src/types/ProjectTypes'
import { Preferences } from 'frontend/src/stores/usePreferencesStore'

export const generateTrace = (node: Node<TMState>): TMExecutionTrace[] => {
  const trace: TMExecutionTrace[] = []
  while (node.parent) {
    trace.push({
      to: node.state.id,
      tape: node.state.tape,
      read: node.state.read,
      write: node.state.write,
      direction: node.state.direction
    })
    node = node.parent
  }
  trace.push({
    to: node.state.id,
    tape: node.state.tape,
    read: null,
    write: null,
    direction: null
  })
  return trace.reverse()
}

export const simulateTM = (
  graph: TMProjectGraph,
  input: string,
  preferences: Preferences
): TMExecutionResult => {
  const problem = buildProblem(graph, input) as TMGraph

  if (!problem) {
    return {
      accepted: false,
      tape: newTape(input),
      trace: []
    }
  }
  if (preferences.pauseTM) {
    const result = breadthFirstSearch(problem)
    if (!result) {
      return {
        trace: [{ to: 0, read: null, tape: null, write: null, direction: null }],
        accepted: false,
        tape: newTape(input)
      }
    }
    return {
      accepted: result.state.isFinal,
      tape: result.state.tape,
      trace: generateTrace(result)
    }
  } else {
    const result = breadthFirstSearchNoPause(problem)
    if (!result) {
      return {
        trace: [{ to: 0, read: null, tape: null, write: null, direction: null }],
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
}
