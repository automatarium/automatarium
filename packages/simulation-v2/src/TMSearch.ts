import {TMTransition, Tape} from "./graph";
import {Graph, Node, State} from "./interfaces/graph";


export class TMState extends State {
    constructor(
        m_id: number,
        m_isFinal: boolean,
        private m_tape: Tape
    ) {
        super(m_id, m_isFinal);
        this.m_tape = m_tape;
    }

    key() {
        const traceAdd = this.m_tape.trace.toString()?? ""
        return String(this.id + traceAdd);
    }

    get tape() {
        return this.m_tape;
    }

    set tape(tape: Tape) {
        this.m_tape = tape
    }
}

export class TMGraph extends Graph<TMState, TMTransition> {
    constructor(initial: Node<TMState>, states: TMState[], transitions: TMTransition[]) {
        super(initial, states, transitions);
    }
    public isFinalState(node: Node<TMState>) {
        return (
            node.state.isFinal
        );
    }

    public getSuccessors(node: Node<TMState>) {
        const transitions = this.transitions.filter(
            (transition) => transition.from === node.state.id,
        );
        const successors: Node<TMState>[] = [];
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

            if (transition.read === symbol) {
                const graphState = new TMState(
                    nextState.id,
                    nextState.isFinal,
                    nextTape
                    // read: symbol
                );
                const successor = new Node(graphState, node);
                successors.push(successor);
            }
        }
        return successors;
    }

    private progressTape(node: Node<TMState>, transition: TMTransition){

        const tapeTrace = node.state.tape.trace
        const write = transition.write
        const direction = transition.direction
        let newTapePointer = structuredClone(node.state.tape.pointer)
        let newTapeTrace = structuredClone(tapeTrace)
        // Direction input handled to only be uppercase
        if (direction === 'L'){
            newTapePointer--
        }
        else if (direction=== 'R'){
            newTapePointer++
        }
        newTapeTrace[node.state.tape.pointer] = write

        const newTape: Tape = {
            pointer: newTapePointer,
            trace: newTapeTrace
        }

        return newTape
    }
}