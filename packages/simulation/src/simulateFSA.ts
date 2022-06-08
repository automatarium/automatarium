import parseRead from './parseRead'
import validTransitions from './validTransitions'
import { UnresolvedFSAGraph, FSAGraph } from './types'

const simulateFSA = (graph: UnresolvedFSAGraph, input: string) => {
  // Resolve graph transitions
  const transitions = graph.transitions.map(transition => ({...transition, read: parseRead(transition.read)}))
  const resolvedGraph: FSAGraph = { ...graph, transitions }
  
  // Simulate
  return simulateFSAGraph(resolvedGraph, input)
}

const simulateFSAGraph = (
  graph: FSAGraph,
  input: string,
  currStateID = graph?.initialState,
  trace = [{
    to: graph?.initialState,
    read: null,
  }]
) => {
  // Find current state
  const currentState = graph.states.find(state => state.id === currStateID)

  // Get next set of possible transitions
  const possibleTransitions = validTransitions(graph, currStateID, input?.[0])

  // Are no transitions possible?
  if (possibleTransitions.length === 0) {
    // No transitions due to no remaining input
    if (input.length === 0) {
      return { accepted: currentState.isFinal === true, trace, remaining: input }
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
    simulateFSAGraph(
      graph,
      transition.read.length === 0 ? input : input.slice(1), // Slice first character off input
      transition.to, // Transition to next possible state
      [...trace, ...nextTrace], // Append next transition to trace
    )
  )

  // Return first accepting trace or longest rejecting
  const acceptingResult = results.find(r => r.accepted)
  return acceptingResult || results.sort((r1, r2) => r2.trace.length - r1.trace.length)[0]
}

export default simulateFSA
