import { FSAGraph, FSATransition, ReadSymbol, StateID } from "./graph";
import { IGraphNode, IGraphState, IProblem } from "./interfaces/graph";

export class FSAGraphNode implements IGraphNode {
    depth: number;
    constructor(
        private m_state: FSAGraphState,
        private m_transition: FSATransition | null = null,
        private m_parent: FSAGraphNode | null = null,
    ) {
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

export class FSAGraphState implements IGraphState {
    constructor(
        public id: StateID,
        public isFinal: boolean,
        private remaining: ReadSymbol, // Symbols left to be read
        private read: ReadSymbol | null = null, // Symbol that was read to when this state was reached
    ) {}

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