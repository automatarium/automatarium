import {TMState, TMTransition, ReadSymbol, Tape} from "./graph";
import { Graph, Node } from "./interfaces/graph";
import {FSAGraphNode} from "./FSASearch";

export class TMGraphNode extends Node<TMState> {
    constructor(
        state: TMState,
        parent: TMGraphNode | null = null,
    ) {
        super(state, parent);
    }

    key(): string {
        return String(this.state.id + this.state.tape.trace.toString());
    }

    get state() {
        return this.m_state;
    }

    get parent() {
        return this.m_parent as TMGraphNode;
    }
}

export class TMGraph extends Graph<TMState, TMTransition, TMGraphNode> {
    constructor(initial: TMGraphNode, states: TMState[], transitions: TMTransition[]) {
        super(initial, states, transitions);
    }
    public isFinalState(node: TMGraphNode) {
        return (
            node.state.isFinal
        );
    }

    public getSuccessors(node: TMGraphNode) {
        const transitions = this.transitions.filter(
            (transition) => transition.from === node.state.id,
        );
        const successors: TMGraphNode[] = [];
        for (const transition of transitions) {
            const nextState = this.states.find(
                (state) => state.id === transition.to,
            );

            const tapePointer = node.state.tape.pointer
            const tapeTrace = node.state.tape.trace

            const symbol = tapeTrace[tapePointer];
            const nextTape = this.progressTape(node, transition)

            // If there is no next state
            if (
                nextState === undefined || (!transition.read.includes(symbol)) || nextTape.pointer<0
            ) {
                continue;
            }

            if (transition.read.includes(symbol)) {
                const graphState: TMState = {
                    id: nextState.id,
                    isFinal: nextState.isFinal,
                    tape: nextTape
                    // read: symbol
                };
                const successor = new TMGraphNode(graphState, node);
                successors.push(successor);
            }
        }
        return successors;
    }

    private progressTape(node: TMGraphNode, transition: TMTransition){

        const tapeTrace = node.state.tape.trace
        const write = transition.write
        const direction = transition.Direction
        let newTapePointer = node.state.tape.pointer
        let newTapeTrace = tapeTrace
        // Direction input handled to only be uppercase
        if (direction === 'L'){
            newTapePointer--
        }
        else if (direction=== 'R'){
            newTapePointer++
        }
        newTapeTrace[newTapePointer] = write

        const newTape: Tape = {
            pointer: newTapePointer,
            trace: newTapeTrace
        }

        return newTape
    }
}