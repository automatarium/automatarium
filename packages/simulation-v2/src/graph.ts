export type State = {
    id: number;
    x: number;
    y: number;
    isFinal: boolean;
}

export type Transition = {
    id: number;
    to: number;
    from: number;
    read: string;
}

export type Successor = {
    state: State;
    transition: Transition;
}

export type GraphNode = {
    state: State;
    transition: Transition | null;
    parent: GraphNode | null;
    depth: number;
}

export type Graph = {
    initialState: number;
    states: State[];
    transitions: Transition[];
}

export class GraphProblem {
    private graph: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
    }

    public getInitialState() {
        const state = this.graph.states.find(state => state.id === this.graph.initialState);
        if (state === undefined) {
            throw new Error("Initial state not found");
        }
        return state;
    }

    public isFinalState(state: State) {
        return state.isFinal;
    }

    public getSuccessors(state: State) {
        const transitions = this.graph.transitions.filter(transition => transition.from === state.id);
        const successors: Successor[] = [];
        for (const transition of transitions) {
            const nextState = this.graph.states.find(state => state.id === transition.to);
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
}

// state parent action