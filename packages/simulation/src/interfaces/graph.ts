import { Transition } from '../graph'

export abstract class State {
  // eslint-disable-next-line no-useless-constructor
  protected constructor (private _id: number, private _isFinal: boolean) {}
  get id () {
    return this._id
  }

  get isFinal () {
    return this._isFinal
  }

    abstract key(): string;
}

export class Node<S extends State> {
  private _depth: number
  constructor (
        protected _state: S,
        protected _parent: Node<S> | null = null
  ) {
    this._depth = _parent ? _parent.depth + 1 : 0
  }

  get depth () {
    return this._depth
  }

  get state () {
    return this._state
  }

  get parent () {
    return this._parent
  }
}

// eslint-disable-next-line no-unused-vars
export abstract class Graph<S extends State, T extends Transition> {
  protected _initial: Node<S>
  protected states: S[]
  public transitions: T[]

  constructor (initial: Node<S>, states: S[], transitions: T[]) {
    this._initial = initial
    this.states = states
    this.transitions = transitions
  }

  get initial () {
    return this._initial
  }

  abstract getSuccessors(node: Node<S>): Node<S>[];

  abstract isFinalState(node: Node<S>): boolean;
}
