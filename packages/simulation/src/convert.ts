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

// This will create the DFA and return it by updating a passed in DFA template from a passed in NFA
export const createDFA = (nfaGraph: FSAGraphIn, dfaGraph: FSAGraphIn): FSAGraphIn => {
  const numberOfNFATransitions: number = nfaGraph.transitions.length;
  let numberOfDFATransitions: number;
  console.log(numberOfDFATransitions);
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