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

type Transition = {
    id: TransitionID;
    to: StateID;
    from: StateID;
};

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

export type ExecutionTrace = {
    read: string | null;
    to: StateID;
};

export type ExecutionResult = {
    accepted: boolean;
    remaining: string;
    trace: ExecutionTrace[];
};
