import { Transition } from '../graph'

export abstract class State {
  get id () {
    return this.id
  }

  get isFinal () {
    return this.isFinal
  }

  abstract key(): string;
}

export class Node<S extends State> {
  private _depth: number
  constructor (
        protected state: S,
        protected parent: Node<S> | null = null
  ) {
    this._depth = parent ? parent.depth + 1 : 0
  }

  get depth () {
    return this._depth
  }

  get state () {
    return this.state
  }

  get parent () {
    return this.parent
  }
}

// eslint-disable-next-line no-unused-vars
export abstract class Graph<S extends State, T extends Transition> {
  get initial () {
    return this.initial
  }

  abstract getSuccessors(node: Node<S>): Node<S>[];
  abstract isFinalState(node: Node<S>): boolean;
}
