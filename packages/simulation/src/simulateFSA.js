const simulateFSA = (
  graph,
  input,
  currStateID = graph?.options?.initialState,
  trace = [graph?.options?.initialState],
  lambdaCount = 0,
  lastTransitionLambda = false
) => {
  // Are we done processing symbols?
  if (input.length === 0) {
    const currState = graph.states.find(state => state.id === currStateID)
    return { accepted: currState.isFinal, trace }
  }

  // Get next set of possible transitions
  const possibleTransitions = graph.transitions.filter(
    tr => tr.from === currStateID && (tr.read === input[0] || (tr.read === '' && lambdaCount < 100))
  )

  // Move lambda transitions to end of array (to prioritise non-lambda transitions)
  possibleTransitions.sort((a, b) => b.read.length - a.read.length)

  // No transitions possible?
  if (possibleTransitions.length === 0) {
    return { accepted: false, trace }
  }

  // Continue recurring
  const results = possibleTransitions.map(tr =>
    simulateFSA(
      graph,
      tr.read === '' ? input : input.slice(1), // Slice first character off input
      tr.to, // Transition to next possible state
      [...trace, tr.to], // Append next transition to trace
      tr.read === '' && lastTransitionLambda ? lambdaCount + 1 : 0, // Increment lambda counter
      tr.read === '' // Tell the next recurse whether this transition was a lambda
    )
  )

  // Return first accepting trace or longest rejecting
  const acceptingResult = results.find(r => r.accepted)
  return acceptingResult || results.sort((r1, r2) => r2.trace.length - r1.trace.length)[0]
}

export default simulateFSA
