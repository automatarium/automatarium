export type ReadSymbol = string;
export type StateID = number;
export type TransitionID = number;
export type PopSymbol = string;
export type PushSymbol = string;

type State = {
    id: StateID;
    isFinal: boolean;
};

export type FSAState = State;
export type PDAState = State;

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
    pop: PopSymbol[];
    push: PushSymbol[];
};

type Graph = {
    initialState: StateID;
    states: State[];
};

export type UnparsedFSAGraph = Graph & {
    transitions: UnparsedFSATransition[];
};

export type UnparsedPDAGraph = Graph & {
    transitions: UnparsedPDATransition[];
}

export type FSAGraph = Graph & {
    transitions: FSATransition[];
};

export type PDAGraph = Graph & {
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
