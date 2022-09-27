import { Transition } from "../graph";

export abstract class State {
    constructor(private m_id: number, private m_isFinal: boolean) {}

    get id() {
        return this.m_id;
    }

    get isFinal() {
        return this.m_isFinal;
    }

    abstract key(): string;
}

export class Node<S extends State> {
    private m_depth: number;
    constructor(
        protected m_state: S,
        protected m_parent: Node<S> | null = null,
    ) {
        this.m_depth = m_parent ? m_parent.depth + 1 : 0;
    }

    get depth() {
        return this.m_depth;
    }

    get state() {
        return this.m_state;
    }

    get parent() {
        return this.m_parent;
    }
}

export abstract class Graph<S extends State, T extends Transition> {
    constructor(
        protected m_initial: Node<S>,
        protected states: S[],
        protected transitions: T[],
    ) {}

    get initial() {
        return this.m_initial;
    }

    abstract getSuccessors(node: Node<S>): Node<S>[];
    abstract isFinalState(node: Node<S>): boolean;
}
