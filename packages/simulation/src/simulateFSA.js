const simulateFSA = (
  graph,
  input,
  currStateID = graph?.initialState,
  trace = [{
    to: graph?.initialState,
    read: null,
  }],
  lambdaCount = 0,
  lastTransitionLambda = false
) => {

  // Get next set of possible transitions
  const possibleTransitions = graph.transitions.filter(
    tr => tr.from === currStateID && (tr.read === input[0] || (tr.read === '' && lambdaCount < 100))
  )

  // Move lambda transitions to end of array (to prioritise non-lambda transitions)
  possibleTransitions.sort((a, b) => b.read.length - a.read.length)

  const currState = graph.states.find(state => state.id === currStateID)

  // No transitions possible?
  if (possibleTransitions.length === 0) {
    // No transitions due to no remaining input
    if (input.length === 0) {
      return { accepted: currState.isFinal, trace, remaining: input }
    // No transitions due to incorrect input character
    } else {
      return { accepted: false, trace, remaining: input }
    }
  }

  // Are we done processing symbols?
  if (input.length === 0 && currState.isFinal) {
    return { accepted: true, trace, remaining: input }
  }

  // Continue recurring
  const results = possibleTransitions.map(tr =>
    simulateFSA(
      graph,
      tr.read === '' ? input : input.slice(1), // Slice first character off input
      tr.to, // Transition to next possible state
      [...trace, {
        to: tr.to,
        read: tr.read,
      }], // Append next transition to trace
      tr.read === '' && lastTransitionLambda ? lambdaCount + 1 : 0, // Increment lambda counter
      tr.read === '' // Tell the next recurse whether this transition was a lambda
    )
  )

  // Return first accepting trace or longest rejecting
  const acceptingResult = results.find(r => r.accepted)
  return acceptingResult || results.sort((r1, r2) => r2.trace.length - r1.trace.length)[0]
}

export default simulateFSA
