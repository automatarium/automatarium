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
    expect(graph).toEqual(convertSimpleConversionDFA)
  })
  test('Graph should be converted correctly to DFA when initial state is not at the start', () => {
    const graph = convertToDFA(convertInitialNotAtStart as FSAProjectGraph)
    expect(graph).toEqual(convertInitialNotAtStartDFA)
  })
  test('Graph should be converted correctly to DFA with multiple final states', () => {
    const graph = convertToDFA(convertMultipleFinal as FSAProjectGraph)
    expect(graph).toEqual(convertMultipleFinalDFA)
  })
  test('Graph should be converted correctly to DFA under harder conditions (2 symbols)', () => {
    const graph = convertToDFA(convertHarderConversion as FSAProjectGraph)
    expect(graph).toEqual(convertHarderConversionDFA)
  })
  test('Graph should use a single trap state instead of multiple when converted to a DFA', () => {
    const graph = convertToDFA(convertSingleTrapState as FSAProjectGraph)
    expect(graph).toEqual(convertSingleTrapStateDFA)
  })
})
