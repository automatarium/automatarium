import { StateID, ReadSymbol } from './graph'
import { AutomataState, FSAProjectGraph } from 'frontend/src/types/ProjectTypes'
import closureWithPredicate from './closureWithPredicate'

// Define useful types
type TransitionTable = Record<StateID, [StateID, ReadSymbol][]>
type CombinedStateArray = [string, { symbol: ReadSymbol, tostates: StateID[] }[]]
type CombinedStates = Record<string, {symbol: ReadSymbol, tostates: StateID[] }[]>

// Graph traversal algorithm starting from the initial state that removes unreachable states and transitions (NFA)
export const removeUnreachableStates = (graph: FSAProjectGraph): FSAProjectGraph => {
  // Keep track of all the reachable states from the initial state
  // We destruct the closure into just a set of states
  const reachableStates = new Set<StateID>([graph.initialState])
  for (const { state } of closureWithPredicate(graph, graph.initialState, () => true)) {
    reachableStates.add(state)
  }
  // Remove any states that are not in the set of reachable states
  graph.states = graph.states.filter(state => reachableStates.has(state.id))
  // Remove any transitions that are not connected to reachable states
  graph.transitions = graph.transitions.filter(transition => reachableStates.has(transition.from) && reachableStates.has(transition.to))
  return graph
}

// This will check to ensure that the graph passed in has valid states/transitions before continuing
export const statesAndTransitionsPresent = (nfaGraph: FSAProjectGraph): boolean => {
  return !(nfaGraph.states.length === 0 || nfaGraph.transitions.length === 0)
}

// This will check to ensure that the graph passed in has a final state before continuing
export const finalStateIsPresent = (nfaGraphStates: AutomataState[]): boolean => {
  return nfaGraphStates.some(state => state.isFinal)
}

// This will check to ensure that the graph passed in has an initial state before continuing
export const initialStateIsPresent = (nfaGraphInitialState: StateID): boolean => {
  return nfaGraphInitialState !== null
}

// This will check that a given states transitions contain all the symbols
function hasAllSymbols (transitions: [StateID, ReadSymbol][], symbols: ReadSymbol[]) {
  for (const symbol of symbols) {
    const symbolFound = transitions.some(([, readSymbol]) => readSymbol === symbol)
    if (!symbolFound) {
      return false
    }
  }
  return true
}

// This function will handle the logic for combining states when necessary
function combineStates (initialTransitionTable: TransitionTable, symbolsArray: ReadSymbol[], curTransitionElem: number, symbolToStatesMap: TransitionTable, symbol: ReadSymbol): CombinedStateArray {
  const filteredTransitions = symbolToStatesMap[symbol].filter(trans => trans[0] === curTransitionElem)
  if (filteredTransitions.length <= 1) {
    return [null, null]
  }
  filteredTransitions.sort((a, b) => a[1] - b[1])
  const curKeyCombination = filteredTransitions.map(trans => trans[1]).join(',')
  const curStateCombination = curKeyCombination.split(',').map(Number)
  const combinedState = symbolsArray.map(symbol => {
    const tostates = curStateCombination.flatMap(curState => {
      return initialTransitionTable[curState]
        .filter(trans => trans[1] === symbol)
        .map(trans => trans[0])
    }).sort()
    return { symbol, tostates }
  })
  return [curKeyCombination, combinedState]
}

// This will mimic STEP 1 of the procedure by ensuring that for every DFA state, there are no lambda transitions and the states are merged correctly
export function removeLambdaTransitions (initialTransitionTable: TransitionTable, mergedStates: {[key: string]: StateID[]}, numberOfNFAStates: StateID, curInitialState: StateID, curFinalStates: StateID[], tempTransitionTable: TransitionTable): [TransitionTable, StateID, StateID[]] {
  for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
    mergedStates[curElem] = [curElem]
  }
  // Merge states until no more merges can be made
  let isMerged = true
  while (isMerged) {
    isMerged = false
    for (let i = 0; i < numberOfNFAStates; i++) {
      const visitedStates = new Set(mergedStates[i])
      // Traverse lambda transitions until no more states can be reached
      for (let j = 0; j < visitedStates.size; j++) {
        const curState = Array.from(visitedStates)[j]
        const curTransitions = initialTransitionTable[curState]
        for (const [toState, symbol] of curTransitions) {
          if (symbol === undefined && !visitedStates.has(toState)) {
            visitedStates.add(toState)
          }
        }
      }
      // Merge the visited states
      const mergedState = Array.from(visitedStates).sort((a, b) => a - b)
      // If the arrays are not equal then merge
      if (!(mergedStates[i].length === mergedState.length && mergedStates[i].every((element, index) => element === mergedState[index]))) {
        mergedStates[i] = mergedState
        isMerged = true
      }
    }
  }

  // Find the new initial state and final state based on the merged states
  let foundInitial = false
  let foundFinals = false
  for (const key in mergedStates) {
    if (!foundInitial && mergedStates[key].includes(curInitialState)) {
      curInitialState = Math.min(...mergedStates[key])
      foundInitial = true
    }
    if (!foundFinals) {
      for (const curKey in mergedStates) {
        // Check if any final states are present in mergedStates
        const mergedFinalStates = curFinalStates.filter(state => mergedStates[curKey].includes(state))
        if (mergedFinalStates.length > 0) {
          // Remove merged final states from curFinalStates
          curFinalStates = curFinalStates.filter(state => !mergedFinalStates.includes(state))
          // Add lowest state ID of mergedStates with the current key to curFinalStates
          curFinalStates.push(Math.min(...mergedStates[curKey]))
        }
      }
      foundFinals = true
    }
    // Exit loop if both new initial and final states have been found
    if (foundInitial && foundFinals) {
      break
    }
  }

  // Merge the states in tempTransitionTable and initialTransitionTable based on the mergedStates array. Go top down so that states that are valid states are also
  // able to transition to the last state in the chain
  for (let curElem = numberOfNFAStates - 1; curElem >= 0; curElem--) {
    const mergedWith = mergedStates[curElem][0]
    for (const curState of mergedStates[curElem].slice(1)) {
      for (let [toState, symbol] of initialTransitionTable[curState]) {
        if (symbol === undefined) {
          for (const [existingToState, existingSymbol] of initialTransitionTable[mergedWith]) {
            if (existingToState === toState) {
              symbol = existingSymbol
              break
            }
          }
        }
        // If a transition with the same symbol and toState doesn't already exist, add it to the tempTransitionTable and initialTransitionTable
        if (symbol !== undefined) {
          let transitionExists = false
          for (const [existingToState, existingSymbol] of tempTransitionTable[mergedWith]) {
            if (existingToState === toState && existingSymbol === symbol) {
              transitionExists = true
              break
            }
          }
          if (!transitionExists) {
            tempTransitionTable[mergedWith].push([toState, symbol])
            initialTransitionTable[mergedWith].push([toState, symbol])
          }
        }
      }
      // Merge all the mergedStates that have been merged into the current state
      for (const mergedState of mergedStates[curElem].slice(1)) {
        mergedStates[mergedState] = mergedStates[mergedWith]
      }
    }
  }

  // STEP 1.5: Remove all lambda transitions and for the "to states" that contain this transition, remove that state and all its transitions
  // if it does not contain any transitions that go into itself, otherwise do nothing. If changes were made, then update the initialTransitionTable
  // accordingly
  const removeTheseStates: StateID[] = []

  // Iterate over all the NFA states and their transitions
  for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
    for (let curStateID = 0; curStateID < initialTransitionTable[curElem].length; curStateID++) {
    // The transition is a lambda transition if its symbol is undefined
      if (initialTransitionTable[curElem][curStateID][1] === undefined) {
      // Check if the state transition to contains a transition to itself
        let sameStateTransitionExists = false
        const checkStateID = initialTransitionTable[curElem][curStateID][0]
        for (let i = 0; i < initialTransitionTable[checkStateID].length; i++) {
          if (initialTransitionTable[checkStateID][i][0] === checkStateID) {
            sameStateTransitionExists = true
          }
        }
        // If there is no transition to itself, mark it for removal
        if (!sameStateTransitionExists) {
          removeTheseStates.push(checkStateID)
        }
        // Remove the lambda transition
        initialTransitionTable[curElem].splice(curStateID, 1)
      }
    }
  }
  // Remove all states marked for removal and update the transition table accordingly
  for (let curElem = 0; curElem < removeTheseStates.length; curElem++) {
    delete initialTransitionTable[removeTheseStates[curElem]]
  }
  return [initialTransitionTable, curInitialState, curFinalStates]
}

// This will mimic STEP 2 of the procedure by ensuring that for every DFA state, there is a symbol transition coming from it
export function createSymbolFromEveryState (initialTransitionTable: TransitionTable, symbolsPresent: Set<ReadSymbol>, numberOfNFAStates: StateID, nfaGraph: FSAProjectGraph) {
  const symbolsArray = Array.from(symbolsPresent)
  const nextAvailableStateID = numberOfNFAStates
  // Go through all the original states defined and see if new states need to be created
  for (let stateID = 0; stateID < numberOfNFAStates; stateID++) {
    // If the state has been removed then ignore it and go to the next one
    if (initialTransitionTable[stateID] !== undefined) {
      // If the state has all the transitions then no need to do anything, go to next state
      if (!hasAllSymbols(initialTransitionTable[stateID], symbolsArray)) {
        // If there isn't a transition going from a particular state, a new state isn't required, it can just transition to itself and still be
        // a trap state. Not strictly required but it will make everything look nicer.
        const hasTransitions = initialTransitionTable[stateID].length > 0
        if ((!hasTransitions && !nfaGraph.states[stateID].isFinal)) {
          for (const symbol of symbolsArray) {
            initialTransitionTable[stateID].push([stateID, symbol])
          }
        } else if (!hasTransitions && nfaGraph.states[stateID].isFinal) {
        // Else if the state is a final state but still needs transitions, it can just put all those transitions into one trap state
          initialTransitionTable[nextAvailableStateID] = []
          // New trap state
          for (const symbol of symbolsArray) {
            initialTransitionTable[nextAvailableStateID].push([nextAvailableStateID, symbol])
          }
          // Transitions to the trap state
          for (const symbol of symbolsArray) {
            const symbolFound = initialTransitionTable[stateID].some(([, readSymbol]) => readSymbol === symbol)
            // If symbol isn't found then transition to the defined trap state
            if (!symbolFound) {
              const existingTransition = initialTransitionTable[stateID].find(([, readSymbol]) => readSymbol === symbol)
              if (!existingTransition) {
                initialTransitionTable[stateID].push([nextAvailableStateID, symbol])
              } else {
                existingTransition[0] = nextAvailableStateID
              }
            }
          }
        } else {
        // Else go each transition and if a symbol is not found, make a new state for it and transition to that state with the given symbol.
          for (const symbol of symbolsArray) {
            const symbolFound = initialTransitionTable[stateID].some(([, readSymbol]) => readSymbol === symbol)
            if (!symbolFound) {
              // Check if a transition already exists for this symbol
              const existingTransition = initialTransitionTable[stateID].find(([, readSymbol]) => readSymbol === symbol)
              // If not, then make a transition to the next state for this symbol for the current state
              if (!existingTransition) {
                initialTransitionTable[stateID].push([nextAvailableStateID, symbol])
                // The next state must be a trap state, so make all the transitions for each symbol go back into it
                initialTransitionTable[nextAvailableStateID] = []
                for (const tempSymbol of symbolsArray) {
                  initialTransitionTable[nextAvailableStateID].push([nextAvailableStateID, tempSymbol])
                }
              } else {
                // If a transition already exists for this symbol, update the destination state ID to the new trap state
                existingTransition[0] = nextAvailableStateID - 1
              }
            }
          }
          // Add the new trap state to initialTransitionTable if it has not been created yet
          if (initialTransitionTable[nextAvailableStateID - 1] === undefined) {
            initialTransitionTable[nextAvailableStateID - 1] = []
            // With this new state, since it is a trap state, just transition to itself for every possible symbol.
            for (const symbol of symbolsArray) {
              initialTransitionTable[nextAvailableStateID - 1].push([nextAvailableStateID - 1, symbol])
            }
          }
        }
      }
    }
  }
  return initialTransitionTable
}

// This will mimic STEP 3 of the procedure by creating a mapping of the symbols and the common "to" states, then if needed, create new states for the DFA using the merging of similar mappings
export function createSymbolsToStateMap (initialTransitionTable: TransitionTable, numberOfNFAStates: number, symbolsPresent: Set<ReadSymbol>, curInitialState: StateID, curFinalStates: StateID[]): [TransitionTable, StateID, StateID[]] {
  let symbolToStatesMap: TransitionTable = {}
  // Contains information about the combined states, where the key will be the states combined, for example if state 2 and 5 are combined the key will be {2,5}
  const newCombinedStates: CombinedStates = {}
  const symbolsArray = Array.from(symbolsPresent)
  for (let fromStateID = 0; fromStateID < numberOfNFAStates; fromStateID++) {
    // If the state is not present then it has been removed and we just ignore it
    if (initialTransitionTable[fromStateID] !== undefined) {
      const transitions = initialTransitionTable[fromStateID]
      // Create a mapping of all transitions that use a given symbol so it will be easier to find transitions for given symbols later
      for (const [toStateID, symbol] of transitions) {
        if (symbol in symbolToStatesMap) {
          symbolToStatesMap[symbol].push([fromStateID, toStateID])
        } else {
          symbolToStatesMap[symbol] = [[fromStateID, toStateID]]
        }
      }
    }
  }

  // This while loop ensures that once states are merged, their to states are merged and checked to see if they exist. If they all do, then there are no new combinations to be made and just exit, otherwise
  // the states need to be merged
  // Now we will continue to create new states to represent merged states until no new states can be created
  const keySet = new Set<string>()
  let newKeyAdded = true
  while (newKeyAdded) {
    newKeyAdded = false
    // Iterate over each symbol in the alphabet
    for (const symbol of Object.keys(symbolToStatesMap)) {
      // Iterate over each transition element for the current symbol
      for (const [curTransitionElem] of symbolToStatesMap[symbol]) {
        // Combine the states that the current transition leads from and to
        const [curKeyCombination, combinedState] = combineStates(initialTransitionTable, symbolsArray, curTransitionElem, symbolToStatesMap, symbol)
        // If a new combined state is created and it hasn't been added to the key set yet, add it to the key set and mark that a new key has been added
        if (combinedState && !keySet.has(curKeyCombination)) {
          newCombinedStates[curKeyCombination] = combinedState
          keySet.add(curKeyCombination)
          newKeyAdded = true
        }
      }
    }
    // Clear the symbol to states mapping
    symbolToStatesMap = {}
    let tempFromState = 0
    // Iterate over each transition in the new combined states
    for (const [, transition] of Object.entries(newCombinedStates)) {
      for (const { symbol, tostates } of transition) {
        // Add the transition to the symbol to states mapping
        if (symbol in symbolToStatesMap) {
          for (const toState of tostates) {
            symbolToStatesMap[symbol].push([tempFromState, toState])
          }
          tempFromState++
        } else {
          symbolToStatesMap[symbol] = tostates.map((toState) => [tempFromState, toState])
          tempFromState++
        }
      }
    }
  }

  // Step 3.5, where the merged states will be added to the initialTransitionTable and current transitions will be modified accordingly. Everything below will do just that
  // by using reference points to the first combined state
  const lastKey = Object.keys(initialTransitionTable)[Object.keys(initialTransitionTable).length - 1]
  let lastKeyNumber = parseInt(lastKey)
  const lastKeyArray = []

  // Increment the last key number by 1 as it will now represent the first merged state, if this is not done then it will overwrite the last state
  lastKeyNumber += 1

  for (const mergedElem of Object.keys(newCombinedStates)) {
    // Split the key by comma, therefore something like {2,3,4} (which represents the merging of those 3 states) which now be individual numbers to get information from
    const stateArray = mergedElem.split(',').map(Number)
    for (let curState = 0; curState < numberOfNFAStates; curState++) {
      if (initialTransitionTable[curState] !== undefined) {
        for (const curSymbolElem of symbolsArray) {
          // Checks if the filtered entries have the same transitions as the current merged state array, if it does then this must be one of the merged states, so remove
          // the old transitions and replace it with a transition to the new merged state
          const filtered = initialTransitionTable[curState].filter(obj => obj[1] === curSymbolElem)
          if (filtered.length > 1 && filtered.length === stateArray.length) {
            filtered.sort((a, b) => a[0] - b[0])
            // Check if the filtered and merged states are exactly the same, if they are then this state must be a merged state and so should be updated accordingly, otherwise do nothing
            const sameTransitions = !filtered.some((item, i) => item[0] !== stateArray[i])
            if (sameTransitions) {
              initialTransitionTable[curState] = initialTransitionTable[curState].filter(obj => obj[1] !== curSymbolElem)
              initialTransitionTable[curState].push([lastKeyNumber, curSymbolElem])
              lastKeyArray.push(lastKeyNumber)
              lastKeyNumber++
            }
          }
        }
      }
    }
  }

  // We can use lastKeyNumber as a reference point to start adding the combined states
  lastKeyNumber = lastKeyArray[0]
  const firstCombinedStateNumber = lastKeyNumber
  const keyArray = Object.keys(newCombinedStates)

  // Go through and add the combined states as well as their transitions based on other combined states (inherent behavior of DFA)
  for (const key of keyArray) {
    // Iterate over each transition in the current combined state
    for (const trans of newCombinedStates[key]) {
      // Get the input symbol and the state(s) that the transition leads to
      const curSymbol = trans.symbol
      const curToState = trans.tostates.join(',')

      // Check whether each of the tostates is also a combined state in the DFA
      for (const tempElem of keyArray) {
        if (tempElem === curToState) {
          // Add the transition to the transition table
          if (initialTransitionTable[lastKeyNumber] === undefined) {
            // If there is no entry for the current key number, create a new entry with the transition
            initialTransitionTable[lastKeyNumber] = [[firstCombinedStateNumber + keyArray.indexOf(tempElem), curSymbol]]
          } else {
            // If there is already an entry for the current key number, add the transition to the existing entry
            initialTransitionTable[lastKeyNumber].push([firstCombinedStateNumber + keyArray.indexOf(tempElem), curSymbol])
          }
        }
      }
    }
    lastKeyNumber++
  }

  // Update initial and final states if needed. This will be checked later to ensure that the states present in here still exist
  for (const key of keyArray) {
    const keySplitArray = key.split(',').map(Number)
    for (const keySplitElem of keySplitArray) {
      if (curInitialState === keySplitElem) {
        curInitialState = firstCombinedStateNumber + keyArray.indexOf(key)
      }
      if (curFinalStates.includes(keySplitElem)) {
        curFinalStates.push(firstCombinedStateNumber + keyArray.indexOf(key))
      }
    }
  }
  return [initialTransitionTable, curInitialState, curFinalStates]
}

// This will create a transition table such that the DFA can be constructed from it. It will return a transitionTable that consists of keys of arrays of key value pairs, where
// the number of keys is equal to the number of states (each key equal to a StateID), where each key will then consist of an array of key value pairs, where the key in this case
// is a StateID of the state the original key (or state in this case) transitions to, and the value is the ReadSymbol for this transition.
export function createTransitionTable (nfaGraph: FSAProjectGraph, numberOfNFAStates: number): [TransitionTable, StateID, StateID[]] {
  let initialTransitionTable: TransitionTable = {}
  const tempTransitionTable: TransitionTable = {}
  const symbolsPresent = new Set<ReadSymbol>()
  const mergedStates: {[key: string]: StateID[]} = {}
  let curInitialState = nfaGraph.initialState
  let curFinalStates: StateID[] = []

  for (const state of nfaGraph.states) {
    if (state.isFinal) {
      curFinalStates.push(state.id)
    }
  }

  // This will create the initial transition table. Note that this is not the final transition table as this is still in NFA form.
  for (const [curElem] of Object.entries(nfaGraph.states)) {
    initialTransitionTable[curElem] = []
    tempTransitionTable[curElem] = []
    for (const transition of nfaGraph.transitions) {
      if (transition.from === Number(curElem)) {
        initialTransitionTable[curElem].push([transition.to, transition.read[0]])
        // Don't add the lambda symbol as it won't exist in the DFA anyway
        if (transition.read[0] !== undefined) {
          symbolsPresent.add(transition.read[0])
        }
      }
    }
  }

  // STEP 1: Merge lambda transitions so that they do not exist and the states are merged accordingly
  // This will ensure that lambda transitions don't exist in the DFA by merging the states together that use them.
  // Initialize mergedStates array with each state in its own set
  let result: [TransitionTable, StateID, StateID[]] = removeLambdaTransitions(initialTransitionTable, mergedStates, numberOfNFAStates, curInitialState, curFinalStates, tempTransitionTable)
  initialTransitionTable = result[0]
  curInitialState = result[1]
  curFinalStates = result[2]
  // STEP 2: Create transitions for every symbol from every state.
  // This will ensure that all states that do not have a transition for all symbols do, which will lead to a "trap state". This is required to be a DFA
  initialTransitionTable = createSymbolFromEveryState(initialTransitionTable, symbolsPresent, numberOfNFAStates, nfaGraph)
  // STEP 3: Create new states for the states that contain two or more "to" transitions for a given symbol, as there can only be one symbol from each transition.
  // could potentailly put this in a for loop that continues to loop and add states to the DFA if needed, while keeping track of how many states there were before the loop so as to
  // not repeat
  result = createSymbolsToStateMap(initialTransitionTable, numberOfNFAStates, symbolsPresent, curInitialState, curFinalStates)
  initialTransitionTable = result[0]
  curInitialState = result[1]
  curFinalStates = result[2]
  return [initialTransitionTable, curInitialState, curFinalStates]
}

// This will create the DFA and return it by updating a passed in DFA template from a passed in NFA
export const createDFA = (nfaGraph: FSAProjectGraph, dfaGraph: FSAProjectGraph): FSAProjectGraph => {
  const numberOfNFAStates: number = nfaGraph.states.length
  const result: [TransitionTable, StateID, StateID[]] = createTransitionTable(nfaGraph, numberOfNFAStates)
  const transitionTable: TransitionTable = result[0]
  const curInitialState: StateID = result[1]
  const curFinalStates: StateID[] = result[2]

  // Initial state
  dfaGraph.initialState = curInitialState

  // States
  for (const curObject of Object.keys(transitionTable)) {
    dfaGraph.states[curObject] = { id: undefined, isFinal: undefined, x: 765, y: 330 }
    dfaGraph.states[curObject].id = parseInt(curObject)
    dfaGraph.states[curObject].isFinal = curFinalStates.includes(dfaGraph.states[curObject].id)
    // Add coordinates here when figured out
  }

  // Transitions
  let transID = 0
  for (const curFromState of Object.keys(transitionTable)) {
    for (const transition of transitionTable[curFromState]) {
      dfaGraph.transitions[transID] = { from: undefined, id: undefined, read: undefined, to: undefined }
      dfaGraph.transitions[transID].from = parseInt(curFromState)
      dfaGraph.transitions[transID].id = transID
      dfaGraph.transitions[transID].read = transition[1]
      dfaGraph.transitions[transID].to = transition[0]
      transID++
    }
  }

  return dfaGraph
}

export const convertNFAtoDFA = (nfaGraph: FSAProjectGraph): FSAProjectGraph => {
  // Do some error checking (could add proper authentic error messaging)
  if (!statesAndTransitionsPresent(nfaGraph)) {
    throw new Error('Error: Graph is not suitable for conversion. Please ensure you have both states and transitions present.')
  } else if (!initialStateIsPresent(nfaGraph.initialState)) {
    throw new Error('Error: Graph is not suitable for conversion. Please ensure that an initial state is declared.')
  } else if (!finalStateIsPresent(nfaGraph.states)) {
    throw new Error('Error: Graph is not suitable for conversion. Please ensure that at least one final state is declared.')
  } else {
    // Remove unreachable states and check to make sure final state is still present. Test graph is used otherwise states are deleted
    // in nfaGraph before returning, which may not be desired
    let testGraph = { ...nfaGraph }
    testGraph = removeUnreachableStates(testGraph)
    if (!finalStateIsPresent(testGraph.states)) {
      throw new Error('Error: Graph is not suitable for conversion. Please ensure your final state is able to be reached by the initial state.')
    } else {
      // DFA doesn't need unreachable states, so remove the unreachable states then proceed
      nfaGraph = removeUnreachableStates(nfaGraph)
      let dfaGraph = {
        projectType: 'FSA',
        initialState: null,
        states: [],
        transitions: []
      } as FSAProjectGraph
      // Sort the states so that they're ordered. This is important as the keys of the objects is used in the conversion algorithm
      nfaGraph.states.sort((a, b) => a.id - b.id)
      // Create a DFA from the given NFA
      dfaGraph = createDFA(nfaGraph, dfaGraph)
      // Remove unreachable states from this new dfaGraph
      dfaGraph = removeUnreachableStates(dfaGraph)
      // Finally copy over the required elements from nfaGraph and return the final dfaGraph
      return dfaGraph
    }
  }
}
