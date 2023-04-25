import { reorderStates } from '../src/reorder'
import { convertNFAtoDFA } from '../src/convert'
import convertFinalNotPresent from './graphs/convertFinalNotPresent.json'
import convertInitialNotPresent from './graphs/convertInitialNotPresent.json'
import convertNoStatesOrTransitionsPresent from './graphs/convertNoStatesOrTransitionsPresent.json'
import convertFinalNotReachable from './graphs/convertFinalNotReachable.json'
import convertSimpleConversion from './graphs/convertSimpleConversion.json'
import convertSimpleConversionDFA from './graphs/convertSimpleConversionDFA.json'
import convertHarderConversion from './graphs/convertHarderConversion.json'
import convertHarderConversionDFA from './graphs/convertHarderConversionDFA.json'
import convertMultipleFinal from './graphs/convertMultipleFinal.json'
import convertMultipleFinalDFA from './graphs/convertMultipleFinalDFA.json'
import convertInitialNotAtStart from './graphs/convertInitialNotAtStart.json'
import convertInitialNotAtStartDFA from './graphs/convertInitialNotAtStartDFA.json'
import convertSingleTrapState from './graphs/convertSingleTrapState.json'
import convertSingleTrapStateDFA from './graphs/convertSingleTrapStateDFA.json'
import { FSAProjectGraph } from 'frontend/src/types/ProjectTypes'

// Required because we can't do `as const` to the imported JSON.
// Means we don't need `as FSAProjectGraph` everywhere
type LooseFSA = Omit<FSAProjectGraph, 'projectType'> & {projectType: string}

const convertToDFA = (project: LooseFSA): FSAProjectGraph => {
  return reorderStates(convertNFAtoDFA(reorderStates(project as FSAProjectGraph)))
}

describe('Check to ensure NFA graph is valid before conversion begins', () => {
  test('Graph should not be processed for conversion if there are no final states', () => {
    expect(() => {
      convertToDFA(convertFinalNotPresent)
    }).toThrow('Error: Graph is not suitable for conversion. Please ensure that at least one final state is declared.')
  })

  test('Graph should not be processed for conversion if there are no initial states', () => {
    expect(() => {
      convertToDFA(convertInitialNotPresent)
    }).toThrow('Error: Graph is not suitable for conversion. Please ensure that an initial state is declared.')
  })

  test('Graph should not be processed for conversion if there are no states or transitions', () => {
    expect(() => {
      convertToDFA(convertNoStatesOrTransitionsPresent)
    }).toThrow('Error: Graph is not suitable for conversion. Please ensure you have both states and transitions present.')
  })

  test('Graph should not be processed for conversion if there are no reachable final states', () => {
    expect(() => {
      convertToDFA(convertFinalNotReachable)
    }).toThrow('Error: Graph is not suitable for conversion. Please ensure your final state is able to be reached by the initial state.')
  })
})

describe('Check to ensure DFA graph is displayed as expected', () => {
  const expectDFA = (nfa: LooseFSA, dfa: LooseFSA) => {
    const graph = convertToDFA(nfa)
    // Only compare fields that are in FSAProjectGraph
    expect(graph.initialState).toEqual(dfa.initialState)
    expect(graph.states).toEqual(dfa.states)
    expect(graph.transitions).toEqual(dfa.transitions)
  }
  test('Graph should be converted correctly to DFA under simple conditions (1 symbol)', () => {
    expectDFA(convertSimpleConversion, convertSimpleConversionDFA)
  })
  test('Graph should be converted correctly to DFA when initial state is not at the start', () => {
    expectDFA(convertInitialNotAtStart, convertInitialNotAtStartDFA)
  })
  test('Graph should be converted correctly to DFA with multiple final states', () => {
    expectDFA(convertMultipleFinal, convertMultipleFinalDFA)
  })
  test('Graph should be converted correctly to DFA under harder conditions (2 symbols)', () => {
    expectDFA(convertHarderConversion, convertHarderConversionDFA)
  })
  test('Graph should use a single trap state instead of multiple when converted to a DFA', () => {
    expectDFA(convertSingleTrapState, convertSingleTrapStateDFA)
  })
})
