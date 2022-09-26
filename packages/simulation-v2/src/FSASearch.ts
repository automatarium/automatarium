import { FSAState, FSATransition, ReadSymbol } from "./graph";
import { Graph, Node } from "./interfaces/graph";

export class FSAGraphNode extends Node<FSAState> {
    constructor(
        state: FSAState,
        parent: FSAGraphNode | null = null,
        private read: ReadSymbol | null = null, // Symbol that was read to when this state was reached
    ) {
        super(state, parent);
    }

    key(): string {
        return String(this.state.id + this.state.remaining);
    }

    get readSymbol() {
        return this.read;
    }

    get state() {
        return this.m_state;
    }

    /* For some reason we need to return this.m_parent as an FSAGraphNode because without it
     * TS thinks it's a Node<FSAState> (which is true, but it isn't specialised)
     * Since the constructor only takes an FSAGraphNode this cast should be safe. */
    get parent() {
        return this.m_parent as FSAGraphNode;
    }
}

export class FSAGraph extends Graph<FSAState, FSATransition, FSAGraphNode> {
    constructor(input: string, initial: FSAGraphNode, states: FSAState[], transitions: FSATransition[]) {
        super(input, initial, states, transitions);
    }
    public isFinalState(node: FSAGraphNode) {
        return (
            node.state.isFinal && node.state.remaining.length === 0
        );
    }

    public getSuccessors(node: FSAGraphNode) {
        const transitions = this.transitions.filter(
            (transition) => transition.from === node.state.id,
        );
        const successors: FSAGraphNode[] = [];
        for (const transition of transitions) {
            const nextState = this.states.find(
                (state) => state.id === transition.to,
            );
            const lambdaTransition = transition.read.length === 0;
            const symbol = node.state.remaining[0];
            if (
                nextState === undefined ||
                (!lambdaTransition && !transition.read.includes(symbol))
            ) {
                continue;
            }
            const graphState: FSAState = {
                id: nextState.id,
                isFinal: nextState.isFinal,
                remaining: lambdaTransition
                    ? node.state.remaining
                    : node.state.remaining.slice(1),
                read: lambdaTransition ? "" : symbol,
            };
            const successor = new FSAGraphNode(graphState, node);
            successors.push(successor);
        }
        return successors;
    }
}