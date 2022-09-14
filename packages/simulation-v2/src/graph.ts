export type ReadSymbol = string;
export type StateID = number;
export type TransitionID = number;

export type State = {
    id: StateID;
    isFinal: boolean;
};

export type Transition = {
    id: TransitionID;
    to: StateID;
    from: StateID;
    read: ReadSymbol[];
};

export type UnparsedTransition = {
    id: TransitionID;
    to: StateID;
    from: StateID;
    read: ReadSymbol;
};

export type Successor = {
    state: FSAGraphState;
    transition: Transition;
};

export type UnparsedFSAGraph = {
    initialState: StateID;
    states: State[];
    transitions: UnparsedTransition[];
};

export type FSAGraph = {
    initialState: StateID;
    states: State[];
    transitions: Transition[];
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

export type FSAGraphState = {
    id: StateID;
    read: ReadSymbol;
    isFinal: boolean;
};

export class GraphNode {
    private m_state: FSAGraphState;
    private m_transition: Transition | null;
    private m_parent: GraphNode | null;
    private m_depth: number;

    constructor(
        state: FSAGraphState,
        transition: Transition | null = null,
        parent: GraphNode | null = null,
    ) {
        this.m_state = state;
        this.m_transition = transition;
        this.m_parent = parent;
        this.m_depth = parent ? parent.m_depth + 1 : 0;
    }

    key() {
        return String(this.m_state.id + this.m_state.read);
    }

    get state() {
        return this.m_state;
    }

    get parent() {
        return this.m_parent;
    }

    get transition() {
        return this.m_transition;
    }

    get depth() {
        return this.m_depth;
    }
}

export class FSAGraphProblem {
    constructor(private m_graph: FSAGraph, private m_input: ReadSymbol) {}

    public getInitialState() {
        const state = this.m_graph.states.find(
            (state) => state.id === this.m_graph.initialState,
        );
        if (state === undefined) {
            throw new Error("Initial state not found");
        }
        const initialState: FSAGraphState = {
            id: state.id,
            read: this.m_input,
            isFinal: state.isFinal,
        };
        return initialState;
    }

    public isFinalState(state: FSAGraphState) {
        return state.isFinal && state.read.length === 0;
    }

    public getSuccessors(state: FSAGraphState) {
        const transitions = this.m_graph.transitions.filter(
            (transition) => transition.from === state.id,
        );
        const successors: Successor[] = [];
        for (const transition of transitions) {
            const nextState = this.m_graph.states.find(
                (state) => state.id === transition.to,
            );
            const lambdaTransition = transition.read.length === 0;
            if (
                nextState === undefined ||
                !lambdaTransition ||
                !transition.read.includes(state.read[0])
            ) {
                continue;
            }
            const graphState: FSAGraphState = {
                id: nextState.id,
                read: lambdaTransition ? state.read : state.read.slice(1),
                isFinal: nextState.isFinal,
            };
            const successor: Successor = {
                state: graphState,
                transition: transition,
            };
            successors.push(successor);
        }
        return successors;
    }

    get input() {
        return this.m_input;
    }
}
