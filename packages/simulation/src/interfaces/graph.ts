import { BaseAutomataTransition } from 'frontend/src/types/ProjectTypes'

export abstract class State {
  // eslint-disable-next-line no-useless-constructor
  protected constructor (readonly id: number, readonly isFinal: boolean) {}

    abstract key(): string;
}

export class Node<S extends State> {
  private readonly depth: number
  constructor (
        readonly state: S,
        readonly parent: Node<S> | null = null
  ) {
    this.depth = parent ? parent.depth + 1 : 0
  }
}

// eslint-disable-next-line no-unused-vars
export abstract class Graph<S extends State, T extends BaseAutomataTransition> {
  readonly initial: Node<S>
  protected states: S[]
  public transitions: T[]

  constructor (initial: Node<S>, states: S[], transitions: T[]) {
    this.initial = initial
    this.states = states
    this.transitions = transitions
  }

  abstract getSuccessors(node: Node<S>): Node<S>[];

  abstract isFinalState(node: Node<S>): boolean;
}
