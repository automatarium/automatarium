import { Graph, Node, State } from './interfaces/graph'
import { FSAAutomataTransition } from 'frontend/src/types/ProjectTypes'
import { extractSymbolsToExclude } from 'frontend/src/util/stringManipulations'

export class FSAState extends State {
  constructor (
    id: number,
    isFinal: boolean,
    readonly read: string | null = null,
    readonly remaining: string = ''
  ) {
    super(id, isFinal)
  }

  key () {
    return String(this.id + this.remaining)
  }

  toTransitionString () {
    // TODO find better place to put function
    const formatSymbol = (char?: string): string =>
      char === null || char === '' ? 'λ' : char

    return `${formatSymbol(this.read)}`
  }
}

export class FSAGraph extends Graph<FSAState, FSAAutomataTransition> {
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
      // Get any symbols preceded by an exclusion operator
      const symbolsToExclude = extractSymbolsToExclude(transition.read)
      if (
        nextState === undefined ||
        (!lambdaTransition && !transition.read.includes(symbol) && (symbolsToExclude.length === 0)) ||
        (!lambdaTransition && (symbolsToExclude.length > 0) && (symbolsToExclude.includes(symbol)))
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
