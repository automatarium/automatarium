import { start } from 'repl';
import { FSAGraphIn, FSAState, FSATransition, StateID, ReadSymbol } from './graph'

// EXTREMELY IMPORTANT NOTE:
// The NFA to DFA conversion relies on sequential StateID's such that each state is ordered from 0 onwards without skipping a number.
// Accounting for anything else gets extremely complicated, as such if non-sequential states can be formed, this should be changed
// rather than this accomodating for that.

// This will check to ensure that the graph passed in has valid states/transitions before continuing
export const statesAndTransitionsPresent = (nfaGraph: FSAGraphIn): boolean => {
    if (nfaGraph.states.length == 0 && nfaGraph.transitions.length == 0) {
        return false;
    }
    else {
        return true;
    }
}

// This will check to ensure that the graph passed in has a final state before continuing
export const finalStateIsPresent = (nfaGraphStates: FSAState[]): boolean => {
    const numberOfNFAStates: number = nfaGraphStates.length;
    let doesFinalExist: boolean = false
    for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
        if (nfaGraphStates[curElem].isFinal) {
            doesFinalExist = true;
        }
    }
    if (!doesFinalExist) {
        return false;
    }
    else {
        return true;
    }
}

// This will check to ensure that the graph passed in has an initial state before continuing
export const initialStateIsPresent = (nfaGraphInitialState: StateID): boolean => {
    if (nfaGraphInitialState == null) {
        return false;
    }
    else {
        return true;
    }
}

// This will check if the merged state is different from the current state's merged state
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

// This will check that a given states transitions contain all the symbols
function hasAllSymbols(transitions, symbols) {
    for (let symbol of symbols) {
        let symbolFound = false;
        for (let [toStateID, readSymbol] of transitions) {
            if (readSymbol === symbol) {
                symbolFound = true;
                break;
            }
        }
        if (!symbolFound) {
            return false;
        }
    }
    return true;
}

// This will create a mapping of the symbols and the common "to" states, this will enable new states to be created if needed for the DFA
export function createSymbolsToStateMap(initialTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]}, numberOfNFAStates: number): {[key: ReadSymbol]: [StateID, StateID][]} {
    let symbolToStatesMap: {[key: ReadSymbol]: [StateID, StateID][]} = {};
    for (let fromStateID = 0; fromStateID < numberOfNFAStates; fromStateID++) {
        let transitions = initialTransitionTable[fromStateID];
        for (let curElem = 0; curElem < transitions.length; curElem++) {
            let toStateID = transitions[curElem][0];
            let symbol = transitions[curElem][1];    
            if (symbolToStatesMap.hasOwnProperty(symbol)) {
                symbolToStatesMap[symbol].push([fromStateID, toStateID]);
            } 
            else {
                symbolToStatesMap[symbol] = [[fromStateID, toStateID]];
            }
        }
    }
    return symbolToStatesMap;
}

// This will create a transition table such that the DFA can be constructed from it. It will return a transitionTable that consists of keys of arrays of key value pairs, where
// the number of keys is equal to the number of states (each key equal to a StateID), where each key will then consist of an array of key value pairs, where the key in this case
// is a StateID of the state the original key (or state in this case) transitions to, and the value is the ReadSymbol for this transition.
export function createTransitionTable(nfaGraph: FSAGraphIn, numberOfNFATransitions: number, numberOfNFAStates: number): {[key: StateID]: [StateID, ReadSymbol][]} {
    let initialTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = {};
    let tempTransitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = {};
    let symbolToStatesMap: {[key: ReadSymbol]: [StateID, StateID][]} = {};
    let symbolsPresent = new Set<ReadSymbol>();
    let mergedStates: {[key: string]: StateID[]} = {};

    // This will create the initial transition table. Note that this is not the final transition table as this is still in NFA form.
    for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
        initialTransitionTable[curElem] = [];
        tempTransitionTable[curElem] = [];
        for (let curStateID = 0; curStateID < numberOfNFATransitions; curStateID++) {
            if (nfaGraph.transitions[curStateID].from == curElem) {
                initialTransitionTable[curElem].push([nfaGraph.transitions[curStateID].to, nfaGraph.transitions[curStateID].read[0]]);
                // Don't add the lambda symbol as it won't exist in the DFA anyway
                if (nfaGraph.transitions[curStateID].read[0] != undefined) {
                    symbolsPresent.add(nfaGraph.transitions[curStateID].read[0]);
                }
            }
        }
    }

    // STEP 1: Merge lambda transitions so that they do not exist.
    // This will ensure that lambda transitions don't exist in the DFA by merging the states together that use them.
    // merge states with undefined transitions

    // Initialize mergedStates array with each state in its own set
    for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
        mergedStates[curElem] = [curElem];
    }

    // Merge states until no more merges can be made
    let isMerged = true;
    while (isMerged) {
        isMerged = false;
        for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
            // Look for lambda transitions
            let statesToMerge = [curElem];
            let visitedStates = new Set(statesToMerge);

            // Traverse lambda transitions until no more states can be reached
            while (statesToMerge.length > 0) {
                let curState = statesToMerge.pop();
                let curTransitions = initialTransitionTable[curState];
                for (let i = 0; i < curTransitions.length; i++) {
                    if (curTransitions[i][1] === undefined) {
                        let toState = curTransitions[i][0];
                        if (!visitedStates.has(toState)) {
                            visitedStates.add(toState);
                            statesToMerge.push(toState);
                        }
                    }
                }
            }

            // Merge the visited states
            let mergedState = Array.from(visitedStates);
            mergedState.sort();
            if (!arraysEqual(mergedStates[curElem], mergedState)) {
                mergedStates[curElem] = mergedState;
                isMerged = true;
            }
        }
    }

    // Merge the states in tempTransitionTable and initialTransitionTable based on the mergedStates array
    for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
        let mergedWith = mergedStates[curElem][0];
        for (let i = 1; i < mergedStates[curElem].length; i++) {
            let curState = mergedStates[curElem][i];
            for (let j = 0; j < initialTransitionTable[curState].length; j++) {
                let toState = initialTransitionTable[curState][j][0];
                let symbol = initialTransitionTable[curState][j][1];

                // If the transition symbol is undefined, find it from the mergedWith state
                if (symbol === undefined) {
                    for (let k = 0; k < initialTransitionTable[mergedWith].length; k++) {
                        let existingTransition = initialTransitionTable[mergedWith][k];
                        if (existingTransition[0] === toState) {
                            symbol = existingTransition[1];
                            break;
                        }
                    }
                }

                // If a transition with the same symbol and toState doesn't already exist, add it to the tempTransitionTable and initialTransitionTable
                if (symbol !== undefined) {
                    let transitionExists = false;
                    for (let k = 0; k < tempTransitionTable[mergedWith].length; k++) {
                        if (tempTransitionTable[mergedWith][k][0] === toState && tempTransitionTable[mergedWith][k][1] === symbol) {
                            transitionExists = true;
                            break;
                        }
                    }
                    if (!transitionExists) {
                        tempTransitionTable[mergedWith].push([toState, symbol]);
                        initialTransitionTable[mergedWith].push([toState, symbol]);
                    }
                }
                // Merge the curState's merged state with the mergedWith state
                mergedStates[curState] = mergedStates[mergedWith];
            }
        }
    }

    // STEP 1.5: Remove all lambda transitions and for the "to states" that contain this transition, remove that state and all its transitions
    // if it does not contain any transitions that go into itself, otherwise do nothing. If changes were made, then update the initialTransitionTable
    // accordingly
    let removeTheseStates: StateID[];
    removeTheseStates = [];
    for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
        for (let curStateID = 0; curStateID < initialTransitionTable[curElem].length; curStateID++) {
            if (initialTransitionTable[curElem][curStateID][1] == undefined) {
                let sameStateTransitionExists = false;
                let checkStateID = initialTransitionTable[curElem][curStateID][0];
                for (let i = 0; i < initialTransitionTable[checkStateID].length; i++) {
                    if (initialTransitionTable[checkStateID][i][0] == checkStateID) {
                        sameStateTransitionExists = true;
                    }
                }
                if (!sameStateTransitionExists) {
                    removeTheseStates.push(checkStateID);
                }
                initialTransitionTable[curElem].splice(curStateID, 1);
            }
        }
    }
    for (let curElem = 0; curElem < removeTheseStates.length; curElem++) {
        delete initialTransitionTable[removeTheseStates[curElem]];
    }

    // STEP 2: Create transitions for every symbol from every state.
    // This will ensure that all states that do not have a transition for all symbols do, which will lead to a "trap state". This is required to be a DFA
    let symbolsArray = Array.from(symbolsPresent);
    let nextAvailableStateID = numberOfNFAStates;
    // Go through all the original states defined and see if new states need to be created
    for (let stateID = 0; stateID < numberOfNFAStates; stateID++) {
        // If the state has been removed then ignore it and go to the next one
        if (initialTransitionTable[stateID] == undefined) {
            continue;
        } 
        else {
            // If the state has all the transitions then no need to do anything, go to next state
            if (hasAllSymbols(initialTransitionTable[stateID], symbolsPresent)) {
                continue;
            } 
            else {
                // If there isn't a transition going from a particular state, a new state isn't required, it can just transition to itself and still be
                // a trap state. Not strictly required but it will make everything look nicer.
                let hasTransitions = initialTransitionTable[stateID].length > 0;
                if (!hasTransitions && !nfaGraph.states[stateID].isFinal) {
                    for (let curElem = 0; curElem < symbolsArray.length; curElem++) {
                        initialTransitionTable[stateID].push([stateID, symbolsArray[curElem]]);
                    }
                }
                // Else go each transition and if a symbol is not found, make a new state for it and transition to that state with the given symbol.
                else {
                    for (let curElem = 0; curElem < symbolsArray.length; curElem++) {
                        let symbolFound = false;
                        for (let [toStateID, readSymbol] of initialTransitionTable[stateID]) {
                            if (readSymbol === symbolsArray[curElem]) {
                                symbolFound = true;
                                break;
                            }
                        }
                        if (!symbolFound) {
                            // Check if a transition already exists for this symbol
                            let existingTransition = initialTransitionTable[stateID].find(([toStateID, readSymbol]) => readSymbol === symbolsArray[curElem]);
                            if (!existingTransition) {
                                initialTransitionTable[stateID].push([nextAvailableStateID, symbolsArray[curElem]]);
                                initialTransitionTable[nextAvailableStateID] = [];
                                for (let curElem2 = 0; curElem2 < symbolsArray.length; curElem2++) {
                                    initialTransitionTable[nextAvailableStateID].push([nextAvailableStateID, symbolsArray[curElem2]]);
                                }
                                nextAvailableStateID++;
                            } else {
                                // If a transition already exists for this symbol, update the destination state ID to the new trap state
                                existingTransition[0] = nextAvailableStateID - 1;
                            }
                        }
                    }
                    // Add the new trap state to initialTransitionTable if it has not been created yet
                    if (initialTransitionTable[nextAvailableStateID - 1] == undefined) {
                        initialTransitionTable[nextAvailableStateID - 1] = [];
                        // With this new state, since it is a trap state, just transition to itself for every possible symbol.
                        for (let curElem = 0; curElem < symbolsArray.length; curElem++) {
                            initialTransitionTable[nextAvailableStateID - 1].push([nextAvailableStateID - 1, symbolsArray[curElem]]);
                        }
                        nextAvailableStateID++;
                    }
                }
            }
        }
    }


    // // STEP 3: Create new states for the states that contain two or more "to" transitions for a given symbol, as there can only be one symbol from each transition.
    // // could potentailly put this in a for loop that continues to loop and add states to the DFA if needed, while keeping track of how many states there were before the loop so as to
    // // not repeat
    // symbolToStatesMap = createSymbolsToStateMap(initialTransitionTable, numberOfNFAStates);

    console.log("Common Symbol States");
    console.log(symbolToStatesMap);
    // This will create the tempTransitionTable from the initial one, which will represent the transition table of the new DFA.
    console.log("Initial Transition Table");
    console.log(initialTransitionTable);
    console.log("All symbols");
    console.log(symbolsPresent);
    return initialTransitionTable;
}

// This will create the DFA and return it by updating a passed in DFA template from a passed in NFA
export const createDFA = (nfaGraph: FSAGraphIn, dfaGraph: FSAGraphIn): FSAGraphIn => {
  const numberOfNFATransitions: number = nfaGraph.transitions.length;
  const numberOfNFAStates: number = nfaGraph.states.length;

  let transitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = createTransitionTable(nfaGraph, numberOfNFATransitions, numberOfNFAStates);
  return dfaGraph;
}

export const convertNFAtoDFA = (nfaGraph: FSAGraphIn): FSAGraphIn => {
    if (!statesAndTransitionsPresent(nfaGraph)) {
        return nfaGraph;
    }
    else if (!initialStateIsPresent(nfaGraph.initialState)) {
        return nfaGraph;
    }
    else if (!finalStateIsPresent(nfaGraph.states)) {
        return nfaGraph;
    }
    else {
        let dfaGraph = {
            initialState: undefined as StateID,
            states: [] as FSAState[],
            transitions: [] as FSATransition[]
        }

        // Create a DFA from the given NFA
        dfaGraph = createDFA(nfaGraph, dfaGraph);

        console.log("Ignore below");
        console.log(nfaGraph.states);
        console.log(nfaGraph.transitions);
        console.log(nfaGraph.initialState);
        console.log(nfaGraph.transitions[0].read)
        return nfaGraph;
    }
}