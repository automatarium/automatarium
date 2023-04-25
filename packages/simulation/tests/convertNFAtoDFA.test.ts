import { reorderStates } from '../src/reorder'
import { convertNFAtoDFA } from '../src/convert'
import convertFinalNotPresent from './graphs/convertFinalNotPresent.json'
import convertInitialNotPresent from './graphs/convertInitialNotPresent.json'
import convertNoStatesOrTransitionsPresent from './graphs/convertNoStatesOrTransitionsPresent.json'
import convertFinalNotReachable from './graphs/convertFinalNotReachable.json'
import convertSimpleConversion from './graphs/convertSimpleConversion.json'
import convertHarderConversion from './graphs/convertHarderConversion.json'
import convertMultipleFinal from './graphs/convertMultipleFinal.json'
import convertInitialNotAtStart from './graphs/convertInitialNotAtStart.json'
import convertSingleTrapState from './graphs/convertSingleTrapState.json'
import { FSAProjectGraph } from 'frontend/src/types/ProjectTypes'

const convertToDFA = (project: FSAProjectGraph): FSAProjectGraph => {
  return reorderStates(convertNFAtoDFA(reorderStates(project)))
}

describe('Check to ensure NFA graph is valid before conversion begins', () => {
  test('Graph should not be processed for conversion if there are no final states', () => {
    expect(() => {
      convertToDFA(convertFinalNotPresent as FSAProjectGraph)
    }).toThrow('Error: Graph is not suitable for conversion. Please ensure that at least one final state is declared.')
  })

  test('Graph should not be processed for conversion if there are no initial states', () => {
    expect(() => {
      convertToDFA(convertInitialNotPresent as FSAProjectGraph)
    }).toThrow('Error: Graph is not suitable for conversion. Please ensure that an initial state is declared.')
  })

  test('Graph should not be processed for conversion if there are no states or transitions', () => {
    expect(() => {
      convertToDFA(convertNoStatesOrTransitionsPresent as FSAProjectGraph)
    }).toThrow('Error: Graph is not suitable for conversion. Please ensure you have both states and transitions present.')
  })

  test('Graph should not be processed for conversion if there are no reachable final states', () => {
    expect(() => {
      convertToDFA(convertFinalNotReachable as FSAProjectGraph)
    }).toThrow('Error: Graph is not suitable for conversion. Please ensure your final state is able to be reached by the initial state.')
  })
})

describe('Check to ensure DFA graph is displayed as expected', () => {
  test('Graph should be converted correctly to DFA under simple conditions (1 symbol)', () => {
    const graph = convertToDFA(convertSimpleConversion as FSAProjectGraph)
    // Initial state should be q0
    expect(graph.initialState).toBe(0)
    // They would be 3 if they got returned as a DFA rather than 4 as an NFA
    expect(graph.states.length).toBe(3)
    // Only q1 should be a final state
    expect((graph.states.find((state) => state.id === 0)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 1)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 2)).isFinal).toBe(false)
    // No lambda transition should be found, and should be 3 transitions total. All transitions should have symbol "A"
    expect(graph.transitions.length).toBe(3)
    expect(graph.transitions.some((transition) => transition.read === undefined)).toBe(false)
    expect(graph.transitions.every((transition) => transition.read === 'A')).toBe(true)
    // Transitions should go in a straight line except the trap state, which goes to itself
    expect(graph.transitions[0].from).toBe(0)
    expect(graph.transitions[0].to).toBe(1)
    expect(graph.transitions[1].from).toBe(1)
    expect(graph.transitions[1].to).toBe(2)
    expect(graph.transitions[2].from).toBe(2)
    expect(graph.transitions[2].to).toBe(2)
  })
  test('Graph should be converted correctly to DFA when initial state is not at the start', () => {
    const graph = convertToDFA(convertInitialNotAtStart as FSAProjectGraph)
    // Initial state should be q0
    expect(graph.initialState).toBe(0)
    // They would be 3 if they got returned as a DFA rather than 4 as an NFA
    expect(graph.states.length).toBe(3)
    // Only q1 should be a final state
    expect((graph.states.find((state) => state.id === 0)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 1)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 2)).isFinal).toBe(false)
    // No lambda transition should be found, and should be 3 transitions total. All transitions should have symbol "A"
    expect(graph.transitions.length).toBe(3)
    expect(graph.transitions.some((transition) => transition.read === undefined)).toBe(false)
    expect(graph.transitions.every((transition) => transition.read === 'A')).toBe(true)
    // Transitions should go in a straight line except the trap state, which goes to itself
    expect(graph.transitions[0].from).toBe(0)
    expect(graph.transitions[0].to).toBe(1)
    expect(graph.transitions[1].from).toBe(1)
    expect(graph.transitions[1].to).toBe(2)
    expect(graph.transitions[2].from).toBe(2)
    expect(graph.transitions[2].to).toBe(2)
  })
  test('Graph should be converted correctly to DFA with multiple final states', () => {
    const graph = convertToDFA(convertMultipleFinal as FSAProjectGraph)
    // Initial state should be q0
    expect(graph.initialState).toBe(0)
    // They would be 3 if they got returned as a DFA rather than 4 as an NFA
    expect(graph.states.length).toBe(3)
    // Only q1 should be a final state
    expect((graph.states.find((state) => state.id === 0)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 1)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 2)).isFinal).toBe(false)
    // No lambda transition should be found, and should be 3 transitions total. All transitions should have symbol "A"
    expect(graph.transitions.length).toBe(3)
    expect(graph.transitions.some((transition) => transition.read === undefined)).toBe(false)
    expect(graph.transitions.every((transition) => transition.read === 'A')).toBe(true)
    // Transitions should go in a straight line except the trap state, which goes to itself
    expect(graph.transitions[0].from).toBe(0)
    expect(graph.transitions[0].to).toBe(1)
    expect(graph.transitions[1].from).toBe(1)
    expect(graph.transitions[1].to).toBe(2)
    expect(graph.transitions[2].from).toBe(2)
    expect(graph.transitions[2].to).toBe(2)
  })
  test('Graph should be converted correctly to DFA under harder conditions (2 symbols)', () => {
    const graph = convertToDFA(convertHarderConversion as FSAProjectGraph)
    // Initial state should be q0
    expect(graph.initialState).toBe(0)
    // They would be 6 if they got returned as a DFA rather than 4 as an NFA
    expect(graph.states.length).toBe(6)
    // Should be two final states, q2 and q3
    expect((graph.states.find((state) => state.id === 0)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 1)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 2)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 3)).isFinal).toBe(true)
    expect((graph.states.find((state) => state.id === 4)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 5)).isFinal).toBe(false)
    // No lambda transition should be found, and should be 12 transitions total. All states should have a single transition 'A' and 'B' from, and be connected in a certain way
    expect(graph.transitions.length).toBe(12)
    expect(graph.transitions.some((transition) => transition.read === undefined)).toBe(false)
    expect(graph.transitions.every((transition) => transition.read === 'A' || transition.read === 'B')).toBe(true)
    // Transitions should be connected appropriately
    expect(graph.transitions.filter((transition) => transition.from === 0).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 0)[0].to).toBeOneOf([1, 3])
    expect(graph.transitions.filter((transition) => transition.from === 0)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 0)[1].to).toBeOneOf([1, 3])
    expect(graph.transitions.filter((transition) => transition.from === 0)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 1).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 1)[0].to).toBeOneOf([2, 1])
    expect(graph.transitions.filter((transition) => transition.from === 1)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 1)[1].to).toBeOneOf([2, 1])
    expect(graph.transitions.filter((transition) => transition.from === 1)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 2).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 2)[0].to).toBe(4)
    expect(graph.transitions.filter((transition) => transition.from === 2)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 2)[1].to).toBe(4)
    expect(graph.transitions.filter((transition) => transition.from === 2)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 3).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 3)[0].to).toBe(5)
    expect(graph.transitions.filter((transition) => transition.from === 3)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 3)[1].to).toBe(5)
    expect(graph.transitions.filter((transition) => transition.from === 3)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 4).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 4)[0].to).toBe(4)
    expect(graph.transitions.filter((transition) => transition.from === 4)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 4)[1].to).toBe(4)
    expect(graph.transitions.filter((transition) => transition.from === 4)[1].read).toBeOneOf(['A', 'B'])

    expect(graph.transitions.filter((transition) => transition.from === 5).length).toBe(2)
    expect(graph.transitions.filter((transition) => transition.from === 5)[0].to).toBe(5)
    expect(graph.transitions.filter((transition) => transition.from === 5)[0].read).toBeOneOf(['A', 'B'])
    expect(graph.transitions.filter((transition) => transition.from === 5)[1].to).toBe(5)
    expect(graph.transitions.filter((transition) => transition.from === 5)[1].read).toBeOneOf(['A', 'B'])
  })
  test('Graph should use a single trap state instead of multiple when converted to a DFA', () => {
    const graph = convertToDFA(convertSingleTrapState as FSAProjectGraph)
    // Initial state should be q0
    expect(graph.initialState).toBe(0)
    // Should be 4 states
    expect(graph.states.length).toBe(4)
    // Should be one final state, q3
    expect((graph.states.find((state) => state.id === 0)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 1)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 2)).isFinal).toBe(false)
    expect((graph.states.find((state) => state.id === 3)).isFinal).toBe(true)
    // No lambda transition should be found, and should be 28 transitions total. All states should have a single transition 'A' to 'G' and be connected in a certain way
    expect(graph.transitions.length).toBe(28)
    const alphabet = 'ABCDEFG'
    expect(graph.transitions.every((transition) => alphabet.includes(transition.read))).toBe(true)
    // Transitions that are not initially present should all go to a single trap state "2"
    const isTrapped = (from: number, toTrap: string) => {
      const transitions = graph.transitions.filter(t => t.from === from)
      expect(transitions.length).toBe(alphabet.length)
      // Find all the transitions that read a symbol we expect to go to a trap state
      const expectedTrapTransitions = transitions
        .filter(t => toTrap.includes(t.read))
        .map(t => t.to)
      expect(new Set(expectedTrapTransitions).size).toBe(1)
      // All trap transitions should be going to state '2' (The trap state)
      expect(expectedTrapTransitions[0]).toBe(2)
    }
    // Transitions that are not initially present should all go to a single trap state "2"
    isTrapped(0, 'CDEFG')
    isTrapped(1, 'AB')
    // This is the trap state, should go to itself for every symbol
    isTrapped(2, alphabet)
    // Final state with no transitions to must all go to a single trap state
    isTrapped(3, alphabet)
  })
})
