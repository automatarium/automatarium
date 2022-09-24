export type ReadSymbol = string;
export type StateID = number;
export type TransitionID = number;

type State = {
    id: StateID;
    isFinal: boolean;
};

export type FSAState = State;

type Transition = {
    id: TransitionID;
    to: StateID;
    from: StateID;
}

export type FSATransition = Transition & {
    read: ReadSymbol[];
};

export type UnparsedFSATransition = {
    id: TransitionID;
    to: StateID;
    from: StateID;
    read: ReadSymbol;
};

export type UnparsedFSAGraph = {
    initialState: StateID;
    states: State[];
    transitions: UnparsedFSATransition[];
};

type Graph = {
    initialState: StateID;
    states: State[];
};

export type FSAGraph = Graph & {
    transitions: FSATransition[];
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

export interface GraphNode {
    depth: number;
    key(): string;
}

export class FSAGraphNode implements GraphNode {
    depth: number;
    constructor(
        private m_state: FSAGraphState,
        private m_transition: FSATransition | null = null,
        private m_parent: FSAGraphNode | null = null,
    ) {
        console.log("Parent: ", m_parent);
        this.depth = m_parent ? m_parent.depth + 1 : 0;
    }

    key(): string {
        return this.m_state.key();
    }

    get state() {
        return this.m_state;
    }

    set state(state: FSAGraphState) {
        this.state = state;
    }

    get transition() {
        return this.m_transition;
    }

    get parent() {
        return this.m_parent;
    }
}

export abstract class GraphState {
    constructor(protected id: StateID, protected isFinal: boolean) {}

    abstract key(): string;
}

export class FSAGraphState extends GraphState {
    constructor(
        id: StateID,
        isFinal: boolean,
        private remaining: ReadSymbol, // Symbols left to be read
        private read: ReadSymbol | null = null, // Symbol that was read to when this state was reached
    ) {
        super(id, isFinal);
    }

    key(): string {
        return String(this.id + this.remaining);
    }

    get stateID() {
        return this.id;
    }

    get isFinalState() {
        return this.isFinal;
    }

    get remainingInput() {
        return this.remaining;
    }

    get readSymbol() {
        return this.read;
    }
}

export interface IProblem<T extends GraphNode> {
    getInitialState(): T | null;
    getSuccessors(node: T): T[];
    isFinalState(node: T): boolean;
}

export class FSAGraphProblem implements IProblem<FSAGraphNode> {
    constructor(private m_graph: FSAGraph, private m_input: ReadSymbol) {}

    /**
     * Search for and return the initial state of the graph
     * @returns The initial state of the graph. If no state was found, the id of the node is -1.
     */
    public getInitialState() {
        const state = this.m_graph.states.find(
            (state) => state.id === this.m_graph.initialState,
        );
        if (state === undefined) {
            return null;
        }
        const initialState = new FSAGraphState(
            state.id,
            state.isFinal,
            this.m_input,
        );
        return new FSAGraphNode(initialState);
    }

    public isFinalState(node: FSAGraphNode) {
        return (
            node.state.isFinalState && node.state.remainingInput.length === 0
        );
    }

    public getSuccessors(node: FSAGraphNode) {
        const transitions = this.m_graph.transitions.filter(
            (transition) => transition.from === node.state.stateID,
        );
        const successors: FSAGraphNode[] = [];
        for (const transition of transitions) {
            const nextState = this.m_graph.states.find(
                (state) => state.id === transition.to,
            );
            const lambdaTransition = transition.read.length === 0;
            const symbol = node.state.remainingInput[0];
            if (
                nextState === undefined ||
                (!lambdaTransition && !transition.read.includes(symbol))
            ) {
                continue;
            }
            const graphState = new FSAGraphState(
                nextState.id,
                nextState.isFinal,
                lambdaTransition
                    ? node.state.remainingInput
                    : node.state.remainingInput.slice(1),
                lambdaTransition ? "" : symbol,
            );
            const successor = new FSAGraphNode(graphState, transition, node);
            successors.push(successor);
        }
        return successors;
    }

    get input() {
        return this.m_input;
    }
}
