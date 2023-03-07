import { PDATransition, Stack } from "./graph";
import { Graph, Node, State } from "./interfaces/graph";

export class PDAState extends State {
    constructor(
        m_id: number,
        m_isFinal: boolean,
        private m_read: string | null = null,
        private m_remaining: string = "",
        private m_stack: Stack = [],
        private m_pop: string = "",
        private m_push: string = "",
    ) {
        super(m_id, m_isFinal);
    }

    get read() {
        return this.m_read;
    }

    get remaining() {
        return this.m_remaining;
    }

    get stack() {
        return this.m_stack;
    }
    get pop() {
        return this.m_pop;
    }

    get push() {
        return this.m_push;
    }

    key() {
        return String(this.id + this.remaining + this.stack.join(""));
    }
}

export class PDAGraph extends Graph<PDAState, PDATransition> {
    constructor(
        initial: Node<PDAState>,
        states: PDAState[],
        transitions: PDATransition[],
    ) {
        super(initial, states, transitions);
    }
    public isFinalState(node: Node<PDAState>) {
        return node.state.isFinal &&
               node.state.remaining.length === 0 &&
               node.state.stack.length === 0;
    }

    public getSuccessors(node: Node<PDAState>) {
        const transitions = this.transitions.filter(
            (transition) => transition.from === node.state.id,
        );
        const successors: Node<PDAState>[] = [];
        
        for (const transition of transitions) {
            
            const nextState = this.states.find(
                (state) => state.id === transition.to,
            );
            let invalidPop = false;
            const lambdaTransition = transition.read.length === 0;
            const symbol = node.state.remaining[0];
            const pop = transition.pop;
            const push = transition.push;

            // If there is no next state
            if (
                nextState === undefined ||
                (!lambdaTransition && !transition.read.includes(symbol))
            ) {
                continue;
            }

            // Check valid stack operations
            let nodeStack = node.state.stack.slice(); // the stack carries forward to each node
            // Handle pop symbol first
            if (pop !== '') {
                // Pop if symbol matches top of stack
                if(pop === nodeStack[nodeStack.length - 1]) {
                    nodeStack.pop();
                }
                // Else operation is invalid
                // Empty stack case
                else if (nodeStack.length === 0) {
                    invalidPop = true;
                }
                // Non-matching symbol case
                else if (pop !== nodeStack[nodeStack.length - 1]) {
                    invalidPop = true;
                }  
            }
            // Handle push symbol if it exists
            if (push !== '') {
                nodeStack.push(push);
            }
            // If stack operations were valid, add the successor
            if (!invalidPop) {
                const graphState = new PDAState(
                    nextState.id,
                    nextState.isFinal,
                    lambdaTransition ? "" : symbol,
                    lambdaTransition
                        ? node.state.remaining
                        : node.state.remaining.slice(1),
                    nodeStack, // the stack carries forward to each node
                    pop,
                    push,
                );
                const successor = new Node(graphState, node);
                successors.push(successor);
            }
        }
        return successors;
    }
}
