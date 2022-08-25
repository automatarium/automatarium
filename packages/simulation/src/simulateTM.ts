import {ExecutionResult, ExecutionTrace, StateID, TMGraph, UnresolvedTMGraph} from './types'
import { validTMTransitions } from './validTMTransitions'
import { resolveTMGraph } from './resolveTMGraph'

/**
 * Simulate and return the execution result of a given FSA with a given input.
 *
 * @param graph - FSA Graph object to simulate
 * @param input - Input to run the FSA against
 * @returns The execution result object including the acceptance state and the trace of states
 */
export const simulateTM = (graph: UnresolvedTMGraph, input: string) => {
  // Resolve graph 
  const resolvedGraph = resolveTMGraph(graph)

  // Simulate
  return simulateTMGraph(resolvedGraph, input)
}

/**
 * Recursively simulate resolved FSA graph
 * @internal
 */
const simulateTMGraph = (
  graph: TMGraph,
  input: string,
  currStateID: StateID = graph?.initialState,
  trace: ExecutionTrace[] = [{
    to: graph?.initialState,
    read: null,
  }]
): ExecutionResult => {
  // Find current state
  const currentState = graph.states.find(state => state.id === currStateID)
  if (!currentState) {
    return { accepted: false, trace, remaining: input }
  }

  // Get next set of possible transitions
  const possibleTransitions = validTMTransitions(graph, currStateID, input?.[0])

  // Are no transitions possible?
  if (possibleTransitions.length === 0) {
    // No transitions due to no remaining input
    if (input.length === 0) {
      return { accepted: currentState.isFinal, trace, remaining: input }
    // No transitions due to incorrect input character
    } else {
      return { accepted: false, trace, remaining: input }
    }
  }

  // Are we done processing symbols?
  if (input.length === 0 && currentState.isFinal) {
    return { accepted: true, trace, remaining: input }
  }

  // Continue recurring
  const results = possibleTransitions.map(({ transition, trace: nextTrace }) =>
    simulateTMGraph(
      graph,
      transition.readSymbol.length === 0 ? input : input.slice(1), // Slice first character off input
      transition.to, // Transition to next possible state
      [...trace, ...nextTrace], // Append next transition to trace
    )
  )

  // Return first accepting trace or longest rejecting
  const acceptingResult = results.find(r => r.accepted)
  return acceptingResult ?? results.sort((r1, r2) => r2.trace.length - r1.trace.length)[0]
}
