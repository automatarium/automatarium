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
};

type Transition = {
    id: TransitionID;
    to: StateID;
    from: StateID;
};

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
    // pop: PopSymbol[];
    // push: PushSymbol[];
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

export type ExecutionTrace = {
    read: string | null;
    to: StateID;
};

export type ExecutionResult = {
    accepted: boolean;
    remaining: string;
    trace: ExecutionTrace[];
};
