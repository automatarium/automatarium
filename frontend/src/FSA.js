const data = require('./tests/dib-nfa2')

const input = 'dib'
var output = []

// Set up array containing all states in machine
const states = []
data.states.map((state) => states.push(state))
console.log('ALL STATES\n', states)
console.log()

// Set initial state as variable
var initial = data.options.initialState
// var currState = undefined
var hasHalted = false

// Transitions currState to targetState based on state id
function transition(targetStateId, output = '') {
  return states.find((state) => state.id === targetStateId)
}

// Find initial state in object of all states
output.push([])
initial = transition(initial)

// Set up array containing all transitions in machine + calculate alphabet
const transitions = []
const alphabet = new Set()
data.transitions.map((transition) => {
  transitions.push(transition)
  alphabet.add(transition.read)
})
console.log('ALPHABET\n', alphabet)
console.log()
console.log('ALL TRANSITIONS\n', transitions)
console.log()

// Filter possible transitions from current state
function calculatePossibleTransitions(currState, inputRead = '') {
  return transitions.filter((transition) => transition.from === currState.id && transition.read === inputRead)
}

// function recursiveTransition(output, currState, input, symbol) {
function recursiveTransition(input, inputIdx, curr) {
  var currState = curr
  const nextTransitions = calculatePossibleTransitions(currState, input[inputIdx])

  nextTransitions.forEach((nextTransition) => {
    console.log('\nINPUT IDX', inputIdx, `(${input[inputIdx]})`)
    console.log('CURRENT STATE\t', curr.id)
    console.log('INPUT SYMBOL\t', input[inputIdx])
    console.log(
      `${currState.id} TRANS'S\t`,
      nextTransitions.map((t) => t.to)
    )
    console.log('CURRENT TRANS\t', nextTransition)
    currState = transition(nextTransition.to) // TODO: output specific index of 2d array

    if (inputIdx < input.length - 1) {
      // inputIdx++
      recursiveTransition(input, inputIdx + 1, currState)
    } else {
      // Machine halted

      console.log('Machine Halted.')
      if (currState.isFinal) {
        console.log('ACCEPTED!')
      }
    }
  })
}

recursiveTransition(input, 0, initial)

// TODO: better iteration of word
// for (const symbol in input) {
//   console.log('POSSIBLE TRANSITIONS\n', calculatePossibleTransitions(input[symbol]))
//   const nextTransitions = calculatePossibleTransitions(input[symbol]) // TODO: currently selects first possible transition
//   nextTransitions.forEach((transition) => recursiveTransition(input[symbol]))

//   if (nextTransition === undefined) {
//     hasHalted = true
//     console.log('\tTHE MACHINE HAS HALTED')
//     console.log()
//     break
//   }
//   console.log('\t CHOSEN TRANSITION', nextTransition)
//   transition(nextTransition.to)
//   console.log()
// }

// console.log()
// console.log('INPUT:\t', input)
// TODO: regexify / ->$/

// Determine state of output
// if (currState.isFinal && !hasHalted) {
//   console.log('OUTPUT:\t', output.slice(0, -4))
//   console.log('The input was accepted!')
// } else if (hasHalted) {
//   console.log('OUTPUT:\t', output.trim() + '|')
//   console.log('The input was rejected! (the machine halted before processing all input)')
// } else if (!currState.isFinal) {
//   console.log('OUTPUT:\t', output.slice(0, -4))
//   console.log('The input was rejected! (halting state was not final)')
// }
