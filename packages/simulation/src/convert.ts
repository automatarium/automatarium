import { FSAGraphIn, FSAState, StateID, ReadSymbol } from './graph'
import { AutomataState, AutomataTransition } from 'frontend/src/types/ProjectTypes'

// Define a type for the DFAGraph
type DFAGraph = {
  initialState: StateID;
  states: AutomataState[];
  transitions: AutomataTransition[];
}

// Graph traversal algorithm starting from the initial state that removes unreachable states and transitions (NFA)
export const removeUnreachableNFAStates = (nfaGraph: FSAGraphIn): FSAGraphIn => {
  // Keep track of all the reachable states from the initial state
  const reachableStates = new Set<StateID>([nfaGraph.initialState])
  // Traverse the graph starting from the initial state
  const stack = [nfaGraph.initialState]
  while (stack.length > 0) {
    const currentState = stack.pop() as StateID
    for (const transition of nfaGraph.transitions) {
      if (transition.from === currentState) {
        // If the transition leads to a new state, add it to the reachable states
        if (!reachableStates.has(transition.to)) {
          reachableStates.add(transition.to)
          stack.push(transition.to)
        }
      }
    }
  }
  // Remove any states that are not in the set of reachable states
  nfaGraph.states = nfaGraph.states.filter((state) => reachableStates.has(state.id))
  // Remove any transitions that are not connected to reachable states
  nfaGraph.transitions = nfaGraph.transitions.filter((transition) => reachableStates.has(transition.from) && reachableStates.has(transition.to))
  return nfaGraph
}

// Graph traversal algorithm starting from the initial state that removes unreachable states and transitions (DFA)
export const removeUnreachableDFAStates = (dfaGraph: DFAGraph): DFAGraph => {
  // Keep track of all the reachable states from the initial state
  const reachableStates = new Set<StateID>([dfaGraph.initialState])
  // Traverse the graph starting from the initial state
  const stack = [dfaGraph.initialState]
  while (stack.length > 0) {
    const currentState = stack.pop() as StateID
    for (const transition of dfaGraph.transitions) {
      if (transition.from === currentState) {
        // If the transition leads to a new state, add it to the reachable states
        if (!reachableStates.has(transition.to)) {
          reachableStates.add(transition.to)
          stack.push(transition.to)
        }
      }
    }
  }
  // Remove any states that are not in the set of reachable states
  dfaGraph.states = dfaGraph.states.filter((state) => reachableStates.has(state.id))
  // Remove any transitions that are not connected to reachable states
  dfaGraph.transitions = dfaGraph.transitions.filter((transition) => reachableStates.has(transition.from) && reachableStates.has(transition.to))
  return dfaGraph
}

// This will check to ensure that the graph passed in has valid states/transitions before continuing
export const statesAndTransitionsPresent = (nfaGraph: FSAGraphIn): boolean => {
  return !(nfaGraph.states.length === 0 || nfaGraph.transitions.length === 0)
}

// This will check to ensure that the graph passed in has a final state before continuing
export const finalStateIsPresent = (nfaGraphStates: FSAState[]): boolean => {
  const numberOfNFAStates: number = nfaGraphStates.length
  let doesFinalExist: boolean = false
  for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
    if (nfaGraphStates[curElem].isFinal) {
      doesFinalExist = true
    }
  }
  return doesFinalExist
}

// This will check to ensure that the graph passed in has an initial state before continuing
export const initialStateIsPresent = (nfaGraphInitialState: StateID): boolean => {
  return nfaGraphInitialState != null
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
function combineStates (initialTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]}, symbolsArray: ReadSymbol[], curTransitionElem: number, symbolToStatesMap: {[key: ReadSymbol]: [StateID, StateID][]}, symbol: ReadSymbol): [string, { symbol: ReadSymbol, tostates: StateID[] }[]] {
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
export function removeLambdaTransitions (initialTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]}, mergedStates: {[key: string]: StateID[]}, numberOfNFAStates: StateID, curInitialState: StateID, curFinalStates: StateID[], tempTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]}): [{[key: StateID]: [StateID, ReadSymbol][]}, StateID, StateID[]] {
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
        const curTransitions = initialTransitionTable[curState] || []
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
    for (let i = 1; i < mergedStates[curElem].length; i++) {
      const curState = mergedStates[curElem][i]
      for (let j = 0; j < initialTransitionTable[curState].length; j++) {
        const toState = initialTransitionTable[curState][j][0]
        let symbol = initialTransitionTable[curState][j][1]
        // If the transition symbol is undefined, find it from the mergedWith state
        if (symbol === undefined) {
          for (let k = 0; k < initialTransitionTable[mergedWith].length; k++) {
            const existingTransition = initialTransitionTable[mergedWith][k]
            if (existingTransition[0] === toState) {
              symbol = existingTransition[1]
              break
            }
          }
        }
        // If a transition with the same symbol and toState doesn't already exist, add it to the tempTransitionTable and initialTransitionTable
        if (symbol !== undefined) {
          let transitionExists = false
          for (let k = 0; k < tempTransitionTable[mergedWith].length; k++) {
            if (tempTransitionTable[mergedWith][k][0] === toState && tempTransitionTable[mergedWith][k][1] === symbol) {
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
    }

    // Merge all the mergedStates that have been merged into the current state
    for (let i = 1; i < mergedStates[curElem].length; i++) {
      const curState = mergedStates[curElem][i]
      mergedStates[curState] = mergedStates[mergedWith]
    }
  }
  // STEP 1.5: Remove all lambda transitions and for the "to states" that contain this transition, remove that state and all its transitions
  // if it does not contain any transitions that go into itself, otherwise do nothing. If changes were made, then update the initialTransitionTable
  // accordingly
  const removeTheseStates: StateID[] = []
  for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
    for (let curStateID = 0; curStateID < initialTransitionTable[curElem].length; curStateID++) {
      if (initialTransitionTable[curElem][curStateID][1] === undefined) {
        let sameStateTransitionExists = false
        const checkStateID = initialTransitionTable[curElem][curStateID][0]
        for (let i = 0; i < initialTransitionTable[checkStateID].length; i++) {
          if (initialTransitionTable[checkStateID][i][0] === checkStateID) {
            sameStateTransitionExists = true
          }
        }
        if (!sameStateTransitionExists) {
          removeTheseStates.push(checkStateID)
        }
        initialTransitionTable[curElem].splice(curStateID, 1)
      }
    }
  }
  for (let curElem = 0; curElem < removeTheseStates.length; curElem++) {
    delete initialTransitionTable[removeTheseStates[curElem]]
  }
  return [initialTransitionTable, curInitialState, curFinalStates]
}

// This will mimic STEP 2 of the procedure by ensuring that for every DFA state, there is a symbol transition coming from it
export function createSymbolFromEveryState (initialTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]}, symbolsPresent: Set<ReadSymbol>, numberOfNFAStates: StateID, nfaGraph: FSAGraphIn) {
  const symbolsArray = Array.from(symbolsPresent)
  let nextAvailableStateID = numberOfNFAStates
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
              const existingTransition = initialTransitionTable[stateID].find(([toStateID, readSymbol]) => readSymbol === symbol)
              if (!existingTransition) {
                initialTransitionTable[stateID].push([nextAvailableStateID, symbol])
              } else {
                existingTransition[0] = nextAvailableStateID
              }
            }
          }
          nextAvailableStateID++
        } else {
        // Else go each transition and if a symbol is not found, make a new state for it and transition to that state with the given symbol.
          for (const symbol of symbolsArray) {
            let symbolFound = false
            for (const [, readSymbol] of initialTransitionTable[stateID]) {
              if (readSymbol === symbol) {
                symbolFound = true
                break
              }
            }
            if (!symbolFound) {
              // Check if a transition already exists for this symbol
              const existingTransition = initialTransitionTable[stateID].find(([toStateID, readSymbol]) => readSymbol === symbol)
              if (!existingTransition) {
                initialTransitionTable[stateID].push([nextAvailableStateID, symbol])
                initialTransitionTable[nextAvailableStateID] = []
                for (const tempSymbol of symbolsArray) {
                  initialTransitionTable[nextAvailableStateID].push([nextAvailableStateID, tempSymbol])
                }
                nextAvailableStateID++
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
            for (let curElem = 0; curElem < symbolsArray.length; curElem++) {
              initialTransitionTable[nextAvailableStateID - 1].push([nextAvailableStateID - 1, symbolsArray[curElem]])
            }
            nextAvailableStateID++
          }
        }
      }
    }
  }
  return initialTransitionTable
}

// This will mimic STEP 3 of the procedure by creating a mapping of the symbols and the common "to" states, then if needed, create new states for the DFA using the merging of similar mappings
export function createSymbolsToStateMap (initialTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]}, numberOfNFAStates: number, symbolsPresent: Set<ReadSymbol>, curInitialState: StateID, curFinalStates: StateID[]): [{[key: StateID]: [StateID, ReadSymbol][]}, StateID, StateID[]] {
  let symbolToStatesMap: {[key: ReadSymbol]: [StateID, StateID][]} = {}
  const newCombinedStates: {[key: string]: {symbol: ReadSymbol, tostates: StateID[]}[]} = {}
  const symbolsArray = Array.from(symbolsPresent)
  for (let fromStateID = 0; fromStateID < numberOfNFAStates; fromStateID++) {
    // If the state is not present then it has been removed and we just ignore it
    if (initialTransitionTable[fromStateID] !== undefined) {
      const transitions = initialTransitionTable[fromStateID]
      for (let curElem = 0; curElem < transitions.length; curElem++) {
        const toStateID = transitions[curElem][0]
        const symbol = transitions[curElem][1]
        if (symbol in symbolToStatesMap) {
          symbolToStatesMap[symbol].push([fromStateID, toStateID])
        } else {
          symbolToStatesMap[symbol] = [[fromStateID, toStateID]]
        }
      }
    }
  }

  // Now we will continue to create new states to represent merged states until no new states can be created
  const keySet = new Set<string>()
  let newKeyAdded = true
  let tempFromState = 0

  // This while loop ensures that once states are merged, their to states are merged and checked to see if they exist. If they all do, then there are no new combinations to be made and just exit, otherwise
  // the states need to be merged
  while (newKeyAdded) {
    newKeyAdded = false
    for (const symbol of Object.keys(symbolToStatesMap)) {
      symbolToStatesMap[symbol].forEach(([curTransitionElem]) => {
        const [curKeyCombination, combinedState] = combineStates(initialTransitionTable, symbolsArray, curTransitionElem, symbolToStatesMap, symbol)
        if (combinedState) {
          if (!keySet.has(curKeyCombination)) {
            newCombinedStates[curKeyCombination] = combinedState
            keySet.add(curKeyCombination)
            newKeyAdded = true
          }
        }
      })
    }
    symbolToStatesMap = {}
    // The from state is just temporary and is not important, so use to identify the sequences
    tempFromState = 0
    for (const [key, value] of Object.entries(newCombinedStates)) {
      for (let transElem = 0; transElem < value.length; transElem++) {
        if (newCombinedStates[key][transElem].symbol in symbolToStatesMap) {
          for (let toStateElem = 0; toStateElem < newCombinedStates[key][transElem].tostates.length; toStateElem++) {
            symbolToStatesMap[newCombinedStates[key][transElem].symbol].push([tempFromState, newCombinedStates[key][transElem].tostates[toStateElem]])
          }
          tempFromState++
        } else {
          // Equal just one state for initialisation, then push the rest
          symbolToStatesMap[newCombinedStates[key][transElem].symbol] = [[tempFromState, newCombinedStates[key][transElem].tostates[0]]]
          for (let toStateElem = 1; toStateElem < newCombinedStates[key][transElem].tostates.length; toStateElem++) {
            symbolToStatesMap[newCombinedStates[key][transElem].symbol].push([tempFromState, newCombinedStates[key][transElem].tostates[toStateElem]])
          }
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
  // Increase by one to get to next key (the new key for initial table)
  lastKeyNumber += 1
  // Go through and look through the initial transition table for a specific pattern of transitions that match the state combination.
  // If found, remove those transitions from the initial transition table and replaces them with a single transition that goes to a new state represented by a new state id
  for (let mergedElem = 0; mergedElem < Object.keys(newCombinedStates).length; mergedElem++) {
    const stateArray = Object.keys(newCombinedStates)[mergedElem].split(',').map(Number)
    for (let curState = 0; curState < numberOfNFAStates; curState++) {
      if (initialTransitionTable[curState] !== undefined) {
        for (let curSymbolElem = 0; curSymbolElem < symbolsArray.length; curSymbolElem++) {
          const filtered = initialTransitionTable[curState].filter(obj => obj[1] === symbolsArray[curSymbolElem])
          // In this case there is a chance that these transitions are what need to be deleted as they have been merged
          if (filtered.length > 1 && filtered.length === stateArray.length) {
            filtered.sort((a, b) => a[0] - b[0])
            let sameTransitions = true
            for (let checkElem = 0; checkElem < filtered.length; checkElem++) {
              if (filtered[checkElem][0] !== stateArray[checkElem]) {
                sameTransitions = false
              }
            }
            // If sameTransitions is still true, then these transitions are what need to be deleted
            if (sameTransitions) {
              initialTransitionTable[curState] = initialTransitionTable[curState].filter(obj => obj[1] !== symbolsArray[curSymbolElem])
              initialTransitionTable[curState].push([lastKeyNumber, symbolsArray[curSymbolElem]])
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
  for (let curElem = 0; curElem < keyArray.length; curElem++) {
    for (let trans = 0; trans < newCombinedStates[keyArray[curElem]].length; trans++) {
      const curSymbol = newCombinedStates[keyArray[curElem]][trans].symbol
      const curToState = newCombinedStates[keyArray[curElem]][trans].tostates.join(',')
      for (let tempElem = 0; tempElem < keyArray.length; tempElem++) {
        if (keyArray[tempElem] === curToState) {
          if (initialTransitionTable[lastKeyNumber] === undefined) {
            initialTransitionTable[lastKeyNumber] = [[firstCombinedStateNumber + tempElem, curSymbol]]
          } else {
            initialTransitionTable[lastKeyNumber].push([firstCombinedStateNumber + tempElem, curSymbol])
          }
        }
      }
    }
    lastKeyNumber++
  }

  // Update initial and final states if needed. This will be checked later to ensure that the states present in here still exist
  for (let curKeyElem = 0; curKeyElem < keyArray.length; curKeyElem++) {
    const keySplitArray = keyArray[curKeyElem].split(',').map(Number)
    for (let keySplitElem = 0; keySplitElem < keySplitArray.length; keySplitElem++) {
      if (curInitialState === keySplitArray[keySplitElem]) {
        curInitialState = firstCombinedStateNumber + curKeyElem
      }
      if (curFinalStates.includes(keySplitArray[keySplitElem])) {
        curFinalStates.push(firstCombinedStateNumber + curKeyElem)
      }
    }
  }
  return [initialTransitionTable, curInitialState, curFinalStates]
}

// This will create a transition table such that the DFA can be constructed from it. It will return a transitionTable that consists of keys of arrays of key value pairs, where
// the number of keys is equal to the number of states (each key equal to a StateID), where each key will then consist of an array of key value pairs, where the key in this case
// is a StateID of the state the original key (or state in this case) transitions to, and the value is the ReadSymbol for this transition.
export function createTransitionTable (nfaGraph: FSAGraphIn, numberOfNFATransitions: number, numberOfNFAStates: number): [{[key: StateID]: [StateID, ReadSymbol][]}, StateID, StateID[]] {
  let initialTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = {}
  const tempTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = {}
  const symbolsPresent = new Set<ReadSymbol>()
  const mergedStates: {[key: string]: StateID[]} = {}
  let curInitialState = nfaGraph.initialState
  let curFinalStates: StateID[] = []
  for (let i = 0; i < numberOfNFAStates; i++) {
    if (nfaGraph.states[i].isFinal) {
      curFinalStates.push(i)
    }
  }

  // This will create the initial transition table. Note that this is not the final transition table as this is still in NFA form.
  for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
    initialTransitionTable[curElem] = []
    tempTransitionTable[curElem] = []
    for (let curStateID = 0; curStateID < numberOfNFATransitions; curStateID++) {
      if (nfaGraph.transitions[curStateID].from === curElem) {
        initialTransitionTable[curElem].push([nfaGraph.transitions[curStateID].to, nfaGraph.transitions[curStateID].read[0]])
        // Don't add the lambda symbol as it won't exist in the DFA anyway
        if (nfaGraph.transitions[curStateID].read[0] !== undefined) {
          symbolsPresent.add(nfaGraph.transitions[curStateID].read[0])
        }
      }
    }
  }

  // STEP 1: Merge lambda transitions so that they do not exist and the states are merged accordingly
  // This will ensure that lambda transitions don't exist in the DFA by merging the states together that use them.
  // Initialize mergedStates array with each state in its own set
  let result: [{[key: StateID]: [StateID, ReadSymbol][]}, StateID, StateID[]] = removeLambdaTransitions(initialTransitionTable, mergedStates, numberOfNFAStates, curInitialState, curFinalStates, tempTransitionTable)
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
export const createDFA = (nfaGraph: FSAGraphIn, dfaGraph: DFAGraph): DFAGraph => {
  const numberOfNFATransitions: number = nfaGraph.transitions.length
  const numberOfNFAStates: number = nfaGraph.states.length

  const result: [{[key: StateID]: [StateID, ReadSymbol][]}, StateID, StateID[]] = createTransitionTable(nfaGraph, numberOfNFATransitions, numberOfNFAStates)
  const transitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = result[0]
  const curInitialState: StateID = result[1]
  const curFinalStates: StateID[] = result[2]
  // Initial state
  dfaGraph.initialState = curInitialState
  // States
  for (let curObject = 0; curObject < Object.keys(transitionTable).length; curObject++) {
    dfaGraph.states[curObject] = { id: undefined, isFinal: undefined, x: 765, y: 330 }
    dfaGraph.states[curObject].id = parseInt(Object.keys(transitionTable)[curObject])
    dfaGraph.states[curObject].isFinal = curFinalStates.includes(dfaGraph.states[curObject].id)
    // Add coordinates here when figured out
  }
  // Transitions
  let transID = 0
  for (let curFromState = 0; curFromState < Object.keys(transitionTable).length; curFromState++) {
    for (let curTrans = 0; curTrans < transitionTable[Object.keys(transitionTable)[curFromState]].length; curTrans++) {
      dfaGraph.transitions[transID] = { from: undefined, id: undefined, read: undefined, to: undefined }
      dfaGraph.transitions[transID].from = Object.keys(transitionTable).map(Number)[curFromState]
      dfaGraph.transitions[transID].id = transID
      dfaGraph.transitions[transID].read = transitionTable[Object.keys(transitionTable)[curFromState]][curTrans][1]
      dfaGraph.transitions[transID].to = transitionTable[Object.keys(transitionTable)[curFromState]][curTrans][0]
      transID++
    }
  }
  return dfaGraph
}

export const convertNFAtoDFA = (nfaGraph: FSAGraphIn): FSAGraphIn | DFAGraph => {
  // Do some error checking (could add proper authentic error messaging)
  if (!statesAndTransitionsPresent(nfaGraph) || !initialStateIsPresent(nfaGraph.initialState) || !finalStateIsPresent(nfaGraph.states)) {
    return nfaGraph
  } else {
    // Remove unreachable states and check to make sure final state is still present. Test graph is used otherwise states are deleted
    // in nfaGraph before returning
    let testGraph = { ...nfaGraph }
    testGraph = removeUnreachableNFAStates(testGraph)
    if (!finalStateIsPresent(testGraph.states)) {
      return nfaGraph
    } else {
      let dfaGraph = {
        initialState: undefined as StateID,
        states: [] as AutomataState[],
        transitions: [] as AutomataTransition[]
      }

      // Sort the states so that they're ordered. This is important as the keys of the objects is used in the conversion algorithm
      nfaGraph.states.sort((a, b) => a.id - b.id)
      // Create a DFA from the given NFA
      dfaGraph = createDFA(nfaGraph, dfaGraph)
      // Remove unreachable states from this new dfaGraph
      dfaGraph = removeUnreachableDFAStates(dfaGraph)
      // Finally copy over the required elements from nfaGraph and return the final dfaGraph
      const { initialState, states, transitions, ...dfaGraphCopy } = nfaGraph
      return { ...dfaGraph, ...dfaGraphCopy }
    }
  }
}
