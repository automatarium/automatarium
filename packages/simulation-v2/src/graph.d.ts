export type ReadSymbol = string;
export type StateID = number;
export type TransitionID = number;

type State = {
    id: StateID;
    isFinal: boolean;
};

export type FSAState = State & {
    remaining: ReadSymbol;
    read: ReadSymbol | null;
};

export type TMState = State & {
    tape: Tape
}

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

export type FSATransition = Transition & {
    read: ReadSymbol[];
};

export type UnparsedFSAGraph = {
    initialState: StateID;
    states: FSAState[];
    transitions: UnparsedFSATransition[];
};

export type FSAGraph = {
    initialState: StateID;
    states: FSAState[];
    transitions: FSATransition[];
};

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

export type TMExecutionTrace = {
    tape: Tape | null
    to: StateID
}

export type TMExecutionResult = {
    halted: boolean
    tape: Tape
    trace: TMExecutionTrace[]
}
