import { reorderStates } from '../src/reorder'
import { convertNFAtoDFA } from '../src/convert'
import convertFinalNotPresent from './graphs/convertFinalNotPresent.json'
import convertInitialNotPresent from './graphs/convertInitialNotPresent.json'
import convertNoStatesOrTransitionsPresent from './graphs/convertNoStatesOrTransitionsPresent.json'
import convertFinalNotReachable from './graphs/convertFinalNotReachable.json'

describe('Check to ensure NFA graph is valid before conversion begins', () => {
    test('Graph should not be processed for conversion if there are no final states', () => {
      const graph = reorderStates(convertNFAtoDFA(reorderStates(convertFinalNotPresent as any) as any) as any)
      // They would be 3 if they got returned as a DFA
      expect(graph.states.length).toBe(4)
    })
  
    test('Graph should not be processed for conversion if there are no initial states', () => {
      const graph = reorderStates(convertNFAtoDFA(reorderStates(convertInitialNotPresent as any) as any) as any)
      // They would be 3 if they got returned as a DFA
      expect(graph.states.length).toBe(4)
    })
  
    test('Graph should not be processed for conversion if there are no states or transitions', () => {
      const graph = reorderStates(convertNFAtoDFA(reorderStates(convertNoStatesOrTransitionsPresent as any) as any) as any)
      // No transitions or states
      expect(graph.states.length).toBe(0)
      expect(graph.transitions.length).toBe(0)
    })
  
    test('Graph should not be processed for conversion if there are no reachable final states', () => {
      const graph = reorderStates(convertNFAtoDFA(reorderStates(convertFinalNotReachable as any) as any) as any)
      // They would be 3 if they got returned as a DFA
      expect(graph.states.length).toBe(4)
      expect(graph.transitions.length).toBe(2)
    })
  })
