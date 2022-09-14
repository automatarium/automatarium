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
    read: ReadSymbol;
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

/**
 * A bag of state that uniquely identifies a node
 */
export type FSAGraphState = {
    id: StateID;
    remaining: ReadSymbol;
    isFinal: boolean;
};

export class GraphNode {
    private m_state: FSAGraphState;
    private m_transition: Transition | null;
    private m_parent: GraphNode | null;
    private m_depth: number;
    private m_read: ReadSymbol;

    constructor(
        state: FSAGraphState,
        transition: Transition | null = null,
        parent: GraphNode | null = null,
        read: ReadSymbol = "",
    ) {
        this.m_state = state;
        this.m_transition = transition;
        this.m_parent = parent;
        this.m_read = read;
        this.m_depth = parent ? parent.m_depth + 1 : 0;
    }

    key() {
        return String(this.m_state.id + this.m_state.remaining);
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

    get read() {
        return this.m_read;
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
            remaining: this.m_input,
            isFinal: state.isFinal,
        };
        return initialState;
    }

    public isFinalState(state: FSAGraphState) {
        return state.isFinal && state.remaining.length === 0;
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
            const symbol = state.remaining[0];
            if (
                nextState === undefined ||
                (!lambdaTransition && !transition.read.includes(symbol))
            ) {
                continue;
            }
            const graphState: FSAGraphState = {
                id: nextState.id,
                remaining: lambdaTransition
                    ? state.remaining
                    : state.remaining.slice(1),
                isFinal: nextState.isFinal,
            };
            const successor: Successor = {
                state: graphState,
                read: lambdaTransition ? "" : symbol,
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
