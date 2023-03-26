/**
 * This file defines most types used
 *
 * If the type has the `In` suffix then it means it is used when passing data from the frontend
 * to the simulator. These types shouldn't be used in other places. These `In` types are a lot simplier compared
 * to the `Graph` class which is used for simulations
 * TODO: Remove the need for `In` types and just the `Graph` type in frontend
 */

export type ReadSymbol = string;
export type StateID = number;
export type TransitionID = number;
export type PopSymbol = string;
export type PushSymbol = string;

export type Tape ={
    pointer: number
    trace: string[]
}

type State = {
    id: StateID;
    isFinal: boolean;
};

export type FSAState = State & {
    remaining: ReadSymbol;
    read: ReadSymbol | null;
};

export type PDAState = State & {
    remaining: ReadSymbol;
    read: ReadSymbol | null;
    stack: string[];
};

export type TMStateIn = State & {
  tape?: Tape // tape is set during execution of simulateTM
}

/**
 * Defines
 */
type Transition = {
    id: TransitionID;
    to: StateID;
    from: StateID;
};

type TMTransition = Transition & {
    read: string
    write: string
    direction: string
}

export type FSATransition = Transition & {
    read: ReadSymbol[];
};

export type PDATransition = Transition & {
    read: ReadSymbol[];
    pop: PopSymbol;
    push: PushSymbol;
};

export type UnparsedTransition = {
    read: string
}

/**
 * Generic graph that could be anything. This is done for JS interop where `parseGraph` will be called
 * to expand read symbols (If needed, turing machines don't have symbols expanded)
 *
 */
export type UnparsedGraph = {
    initialState: StateID
    transitions: UnparsedTransition[]
}

export type FSAGraphIn = {
    initialState: StateID;
    states: FSAState[];
    transitions: FSATransition[];
};

export type PDAGraphIn = {
    initialState: StateID;
    states: PDAState[];
    transitions: PDATransition[];
}

// Will be used for importing from front end
export type TMGraphIn = {
    initialState: StateID
    states: TMStateIn[]
    transitions: TMTransition[]
}

export type ExecutionTrace = {
    read: string | null;
    to: StateID;
};

export type ExecutionResult = {
    accepted: boolean;
    remaining: string;
    trace: ExecutionTrace[];
};

export type Stack = string[];

export type PDAExecutionTrace = {
    read: string | null;
    to: StateID;
    pop: string;
    push: string;
    currentStack: Stack;
    invalidPop: boolean;
};

export type PDAExecutionResult = {
    accepted: boolean;
    remaining: string;
    trace: PDAExecutionTrace[];
    stack: Stack;
}

export type TMExecutionTrace = {
    tape: Tape | null
    to: StateID
}

export type TMExecutionResult = {
    halted: boolean
    tape: Tape
    trace: TMExecutionTrace[]
}
