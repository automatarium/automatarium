const simulateFSA = (
  graph,
  input,
  currStateID = graph?.initialState,
  trace = [graph?.initialState],
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

const x = simulateFSA({
  initialState: 0,
  states: [{
    id: 0, //TODO: can be int?
    label: null,
    x: 150,
    y: 150,
    isFinal: false,
  }, {
    id: 1,
    label: null,
    x: 330,
    y: 150,
    isFinal: false,
  },{
    id: 2,
    label: null,
    x: 150,
    y: 350,
    isFinal: false,
  }, {
    id: 3,
    label: null,
    x: 550,
    y: 350,
    isFinal: true,
  }],
  transitions: [{
    from: 0,
    to: 1,
    read: 'a',
  }, {
    from: 1,
    to: 2,
    read: 'z',
  },{
    from: 2,
    to: 3,
    read: 'a'
  }, {
    from: 2,
    to: 3,
    read: 'b'
  }, {
    from: 2,
    to: 3,
    read: 'c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t',
  }]}, 'azb')

  console.log(x);
// export default simulateFSA
