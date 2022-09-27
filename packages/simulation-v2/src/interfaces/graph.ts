import { State, Transition } from "../graph";

export abstract class Node<S extends State> {
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

    abstract key(): string;
}

export abstract class Graph<S extends State, T extends Transition, N extends Node<S>> {
    constructor(protected m_initial: N, protected states: S[], protected transitions: T[]) {}

    get initial() {
        return this.m_initial;
    }

    abstract getSuccessors(node: N): N[];
    abstract isFinalState(node: N): boolean;
}