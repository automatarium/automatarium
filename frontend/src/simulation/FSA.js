const { options, states, transitions } = require('./tests/dib-nfa2')

const input = 'dib'
let output = []

// Set up array containing all states in machine
console.log('ALL STATES\n', states)
console.log()

// var currState = undefined
// let hasHalted = false

// Transitions currState to targetState based on state id
const transition = (targetStateId, output = '') => states.find((state) => state.id === targetStateId)

// Set initial state as variable
// Find initial state in object of all states
output.push([])
const initial = transition(options.initialState)

// Set up array containing all transitions in machine + calculate alphabet
const alphabet = new Set(transitions.map((transition) => transition.read))
console.log('ALPHABET\n', alphabet)
console.log()
console.log('ALL TRANSITIONS\n', transitions)
console.log()

// Filter possible transitions from current state
const calculatePossibleTransitions = (currState, inputRead = '') =>
  transitions.filter((transition) => transition.from === currState.id && transition.read === inputRead)

// TODO: check infinite loops
const simulateNFA = (input, inputIdx, curr, currOutput) => {
  console.log()
  // console.log('CURRENT OUTPUT', currOutput)
  let output = currOutput
  const nextTransitions = calculatePossibleTransitions(curr, input[inputIdx])
  // console.log('BLAH', curr.id, input[inputIdx], nextTransitions)

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
      `${curr.id} TRANS'S\t`,
      nextTransitions.map((t) => t.to)
    )
    console.log('SELECTED TRANS\t', nextTransition.to)
    curr = transition(nextTransition.to, output) // TODO: output specific index of 2d array

    // There is more input to process
    if (inputIdx < input.length - 1) {
      simulateNFA(input, inputIdx + 1, curr, output.concat(curr.id + ' -> '))
      // The last character is reached
    } else if (inputIdx == input.length - 1) {
      console.log('Last symbol of input reached.')
      output = output.concat(curr.id)
      console.log('OUTPUT:', output)
      // Machine halted
    } else {
      console.log('Machine Halted.')
      if (curr.isFinal) {
        console.log('ACCEPTED!')
      }
      console.log('OUTPUT:', output)
    }
  })
}

console.log('INPUT:\t', input)
simulateNFA(input, 0, initial, initial.id + ' -> ')
