const data = require('./tests/dib')

const input = 'diiiiib'
var output = ''

// Set up array containing all states in machine
const states = []
data.states.map((state) => states.push(state))
console.log('ALL STATES\n', states)
console.log()

// Set initial state as variable
const initial = data.options.initialState
var currState = undefined
var hasHalted = false

// Transitions currState to targetState based on state id
function transition(targetStateId) {
  states.forEach((state) => {
    if (state.id === targetStateId) {
      currState = state
      output = output.concat(currState.id, ' -> ')
    }
  })
}

// Find initial state in object of all states
transition(initial)

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

// Set up and calculate alphabet

// Filter possible transitions from current state
// TODO: check for read as well
function calculatePossibleTransitions(inputRead = '') {
  return transitions.filter((transition) => transition.from === currState.id && transition.read === inputRead)
}

// TODO: better iteration of word
for (const symbol in input) {
  console.log('POSSIBLE TRANSITIONS\n', calculatePossibleTransitions(input[symbol]))
  const nextTransition = calculatePossibleTransitions(input[symbol])[0] // TODO: currently selects first possible transition
  if (nextTransition === undefined) {
    hasHalted = true
    console.log('\tTHE MACHINE HAS HALTED')
    console.log()
    break
  }
  console.log('\t CHOSEN TRANSITION', nextTransition)
  transition(nextTransition.to)
  console.log()
}

console.log('INPUT:\t', input)
// TODO: regexify / ->$/

// Determine state of output
if (currState.isFinal && !hasHalted) {
  console.log('OUTPUT:\t', output.slice(0, -4))
  console.log('The input was accepted!')
} else if (hasHalted) {
  console.log('OUTPUT:\t', output.trim() + '|')
  console.log('The input was rejected! (the machine halted before processing all input)')
} else if (!currState.isFinal) {
  console.log('OUTPUT:\t', output.slice(0, -4))
  console.log('The input was rejected! (halting state was not final)')
}
