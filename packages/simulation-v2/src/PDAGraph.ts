import { PDAState, PDATransition, ReadSymbol } from "./graph";
import { Graph, Node } from "./interfaces/graph";

export class PDAGraphNode extends Node<PDAState> {
    constructor(
        state: PDAState,
        parent: PDAGraphNode | null = null,
    ) {
        super(state, parent);
    }

    key(): string {
        return String(this.state.id + this.state.remaining);
    }

    get state() {
        return this.m_state;
    }

    /* For some reason we need to return this.m_parent as an PDAGraphNode because without it
     * TS thinks it's a Node<PDAState> (which is true, but it isn't specialised)
     * Since the constructor only takes an PDAGraphNode this cast should be safe. */
    get parent() {
        return this.m_parent as PDAGraphNode;
    }
}

export class PDAGraph extends Graph<PDAState, PDATransition, PDAGraphNode> {
    constructor(input: string, initial: PDAGraphNode, states: PDAState[], transitions: PDATransition[]) {
        super(input, initial, states, transitions);
    }
    public isFinalState(node: PDAGraphNode) {
        return (
            node.state.isFinal && node.state.remaining.length === 0
        );
    }

    public getSuccessors(node: PDAGraphNode) {
        const transitions = this.transitions.filter(
            (transition) => transition.from === node.state.id,
        );
        const successors: PDAGraphNode[] = [];
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
            const graphState: PDAState = {
                id: nextState.id,
                isFinal: nextState.isFinal,
                remaining: lambdaTransition
                    ? node.state.remaining
                    : node.state.remaining.slice(1),
                read: lambdaTransition ? "" : symbol,
            };
            const successor = new PDAGraphNode(graphState, node);
            successors.push(successor);
        }
        return successors;
    }
}