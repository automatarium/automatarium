export type ReadSymbol = string
export type StateID = number
export type TransitionID = number

export type State = {
    id: StateID;
    isFinal: boolean;
}

export type Transition = {
    id: TransitionID;
    to: StateID;
    from: StateID;
    read: ReadSymbol[];
}

export type UnparsedTransition = {
    id: TransitionID;
    to: StateID;
    from: StateID;
    read: ReadSymbol;
}

export type Successor = {
    state: State;
    transition: Transition;
}

export type GraphNode = {
    state: State;
    read: ReadSymbol | "";
    transition: Transition | null;
    parent: GraphNode | null;
    depth: number;
}

export type UnparsedFSAGraph = {
    initialState: StateID;
    states: State[];
    transitions: UnparsedTransition[];
}

export type FSAGraph = {
    initialState: StateID;
    states: State[];
    transitions: Transition[];
}

export type ExecutionTrace = {
    read: string | null,
    to: StateID
}

export type ExecutionResult = {
    accepted: boolean
    remaining: string
    trace: ExecutionTrace[]
}

export class FSAGraphProblem {
    private m_graph: FSAGraph;
    private m_input: ReadSymbol;

    constructor(graph: FSAGraph, input: ReadSymbol) {
        this.m_graph = graph;
        this.m_input = input;
    }

    public getInitialState() {
        const state = this.m_graph.states.find(state => state.id === this.m_graph.initialState);
        if (state === undefined) {
            throw new Error("Initial state not found");
        }
        return state;
    }

    public isFinalState(state: State) {
        return state.isFinal;
    }

    public getSuccessors(state: State) {
        const transitions = this.m_graph.transitions.filter(transition => transition.from === state.id);
        const successors: Successor[] = [];
        for (const transition of transitions) {
            const nextState = this.m_graph.states.find(state => state.id === transition.to);
            if (nextState === undefined) {
                continue;
            }
            const successor: Successor = {
                state: nextState,
                transition,
            }
            successors.push(successor);
        }
        return successors;
    }

    get input() {
        return this.m_input;
    }
}

// state parent action