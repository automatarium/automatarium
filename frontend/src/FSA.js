const data = require('./tests/dib-nfa')

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
function recursiveTransition(input, inputIdx, curr, currOutput) {
  console.log()
  // console.log('CURRENT OUTPUT', currOutput)
  let currState = curr
  let output = currOutput
  const nextTransitions = calculatePossibleTransitions(currState, input[inputIdx])
  // console.log('BLAH', currState.id, input[inputIdx], nextTransitions)

  if (nextTransitions.length == 0) {
    console.log('MACHINE HALTING!!')
    output = output.slice(0, -1).concat('|')
    console.log(output)
  }

  nextTransitions.forEach((nextTransition) => {
    console.log()
    console.log('CURRENT STATE\t', curr.id)
    console.log('INPUT SYMBOL\t', input[inputIdx])
    console.log(
      `${currState.id} TRANS'S\t`,
      nextTransitions.map((t) => t.to)
    )
    console.log('SELECTED TRANS\t', nextTransition.to)
    currState = transition(nextTransition.to, output) // TODO: output specific index of 2d array

    // There is more input to process
    if (inputIdx < input.length - 1) {
      recursiveTransition(input, inputIdx + 1, currState, output.concat(currState.id + ' -> '))
      // The last character is reached
    } else if (inputIdx == input.length - 1) {
      console.log('Last symbol of input reached.')
      output = output.concat(currState.id)
      console.log('OUTPUT:', output)
      // Machine halted
    } else {
      console.log('Machine Halted.')
      if (currState.isFinal) {
        console.log('ACCEPTED!')
      }
      console.log('OUTPUT:', output)
    }
  })
}

console.log('INPUT:\t', input)
recursiveTransition(input, 0, initial, initial.id + ' -> ')

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
