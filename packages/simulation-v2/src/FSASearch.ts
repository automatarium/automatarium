import { FSATransition } from './graph'
import { Graph, Node, State } from './interfaces/graph'

export class FSAState extends State {
  constructor (
    _id: number,
    _isFinal: boolean,
    private _read: string | null = null,
    private _remaining: string = ''
  ) {
    super(_id, _isFinal)
  }

  get read () {
    return this._read
  }

  get remaining () {
    return this._remaining
  }

  key () {
    return String(this.id + this.remaining)
  }
}

export class FSAGraph extends Graph<FSAState, FSATransition> {
  public isFinalState (node: Node<FSAState>) {
    return node.state.isFinal && node.state.remaining.length === 0
  }

  public getSuccessors (node: Node<FSAState>) {
    const transitions = this.transitions.filter(
      (transition) => transition.from === node.state.id
    )
    const successors: Node<FSAState>[] = []
    for (const transition of transitions) {
      const nextState = this.states.find(
        (state) => state.id === transition.to
      )
      const lambdaTransition = transition.read.length === 0
      const symbol = node.state.remaining[0]
      if (
        nextState === undefined ||
                (!lambdaTransition && !transition.read.includes(symbol))
      ) {
        continue
      }
      const graphState = new FSAState(
        nextState.id,
        nextState.isFinal,
        lambdaTransition ? '' : symbol,
        lambdaTransition
          ? node.state.remaining
          : node.state.remaining.slice(1)
      )
      const successor = new Node(graphState, node)
      successors.push(successor)
    }
    return successors
  }
}
