import { FSAGraphIn, FSAState, FSATransition, StateID, ReadSymbol } from './graph'

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

// This will create a transition table such that the DFA can be constructed from it. It will return a transitionTable that consists of keys of arrays of key value pairs, where
// the number of keys is equal to the number of states (each key equal to a StateID), where each key will then consist of an array of key value pairs, where the key in this case
// is a StateID of the state the original key (or state in this case) transitions to, and the value is the ReadSymbol for this transition.
export function createTransitionTable(nfaGraph: FSAGraphIn, numberOfNFATransitions: number, numberOfNFAStates: number): {[key: StateID]: [StateID, ReadSymbol][]} {
    let transitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = {}
    for (let curElem = 0; curElem < numberOfNFAStates; curElem++) {
        transitionTable[curElem] = [];
        for (let curStateID = 0; curStateID < numberOfNFATransitions; curStateID++) {
            if (nfaGraph.transitions[curStateID].from == curElem) {
                transitionTable[curElem].push([nfaGraph.transitions[curStateID].to, nfaGraph.transitions[curStateID].read[0]])
            }
        }
    }
    return transitionTable;
}

// This will create the DFA and return it by updating a passed in DFA template from a passed in NFA
export const createDFA = (nfaGraph: FSAGraphIn, dfaGraph: FSAGraphIn): FSAGraphIn => {
  const numberOfNFATransitions: number = nfaGraph.transitions.length;
  const numberOfNFAStates: number = nfaGraph.states.length;
  let numberOfDFATransitions: number;

  let transitionTable: {[key: StateID]: [StateID, ReadSymbol][]} = createTransitionTable(nfaGraph, numberOfNFATransitions, numberOfNFAStates);
  console.log(transitionTable);
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

        console.log(nfaGraph.states);
        console.log(nfaGraph.transitions);
        console.log(nfaGraph.initialState);
        console.log(nfaGraph.transitions[0].read)
        return nfaGraph;
    }
}