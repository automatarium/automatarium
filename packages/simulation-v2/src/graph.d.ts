import {TMState} from "./TMSearch";

export type ReadSymbol = string;
export type StateID = number;
export type TransitionID = number;
export type PopSymbol = string;
export type PushSymbol = string;

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

export type UnparsedFSATransition = Transition & {
    read: ReadSymbol;
};

export type UnparsedPDATransition = Transition & {
    read: ReadSymbol;
    pop: PopSymbol;
    push: PushSymbol;
}

export type FSATransition = Transition & {
    read: ReadSymbol[];
};

export type PDATransition = Transition & {
    read: ReadSymbol[];
    pop: PopSymbol;
    push: PushSymbol;
};

export type UnparsedFSAGraph = {
    initialState: StateID;
    states: FSAState[];
    transitions: UnparsedFSATransition[];
};

export type UnparsedPDAGraph = {
    initialState: StateID;
    states: PDAState[];
    transitions: UnparsedPDATransition[];
};

export type FSAGraph = {
    initialState: StateID;
    states: FSAState[];
    transitions: FSATransition[];
};

export type PDAGraph = {
    initialState: StateID;
    states: PDAState[];
    transitions: PDATransition[];
}

// Will be used for importing from front end
export type TMGraphIn = {
    initialState: StateID
    states: TMState[]
    transitions: TMTransition[]
}


export type ExecutionTrace = {
    read: string | null;
    to: StateID;
};

export type Tape ={
    pointer: number
    trace: string[]
}

export type ExecutionResult = {
    accepted: boolean;
    remaining: string;
    trace: ExecutionTrace[];
};

export type PDAExecutionResult = {
    accepted: boolean;
    remaining: string;
    trace: PDAExecutionTrace[];
    stack: Stack;
}

export type PDAExecutionTrace = {
    read: string | null;
    to: StateID;
    pop: string;
    push: string;
    currentStack: Stack;
    invalidPop: boolean;
};

export type Stack = string[];

export type TMExecutionTrace = {
    tape: Tape | null
    to: StateID
}

export type TMExecutionResult = {
    halted: boolean
    tape: Tape
    trace: TMExecutionTrace[]
}
