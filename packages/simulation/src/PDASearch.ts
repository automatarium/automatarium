import { Graph, Node, State } from './interfaces/graph'
import { Stack } from './graph'
import { PDAAutomataTransition } from 'frontend/src/types/ProjectTypes'
import { extractSymbolsToExclude } from 'frontend/src/util/stringManipulations'

export class PDAState extends State {
  constructor (
    id: number,
    isFinal: boolean,
    readonly read: string | null = null,
    readonly remaining: string = '',
    readonly stack: Stack = [],
    readonly pop: string = '',
    readonly push: string = ''
  ) {
    super(id, isFinal)
  }

  key () {
    // It is important that the key values are seperated or else collisions could occur
    // e.g. if the remaining is A and the stack is A, that would be the same as remaining AA with empty stack.
    // They are divided by the ID so that collisions won't occur if a dividing character appears
    return String(this.remaining + this.id.toString() + this.stack.join(''))
  }
}

export class PDAGraph extends Graph<PDAState, PDAAutomataTransition> {
  public isFinalState (node: Node<PDAState>) {
    return node.state.isFinal &&
               node.state.remaining.length === 0 &&
               node.state.stack.length === 0
  }

  public getSuccessors (node: Node<PDAState>) {
    const transitions = this.transitions.filter(
      transition => transition.from === node.state.id
    )
    const successors: Node<PDAState>[] = []

    for (const transition of transitions) {
      const nextState = this.states.find(
        (state) => state.id === transition.to
      )
      let invalidPop = false
      const lambdaTransition = transition.read.length === 0
      const symbol = node.state.remaining[0]
      // Get any symbols preceded by an exclusion operator
      const symbolsToExclude = extractSymbolsToExclude(transition.read)
      const pop = transition.pop
      const push = transition.push

      // If there is no next state
      if (
        nextState === undefined ||
        (!lambdaTransition && !transition.read.includes(symbol) && (symbolsToExclude.length === 0)) ||
        (!lambdaTransition && (symbolsToExclude.length > 0) && (symbolsToExclude.includes(symbol)))
      ) {
        continue
      }

      // Check valid stack operations
      const nodeStack = node.state.stack.slice() // the stack carries forward to each node
      // Handle pop symbol first
      if (pop !== '') {
        // Pop if symbol matches top of stack
        if (pop === nodeStack[nodeStack.length - 1]) {
          nodeStack.pop()
        } else if (nodeStack.length === 0) {
          // Else operation is invalid
          // Empty stack case
          invalidPop = true
        } else if (pop !== nodeStack[nodeStack.length - 1]) {
          // Non-matching symbol case
          invalidPop = true
        }
      }
      // Handle push symbol if it exists
      if (push !== '') {
        nodeStack.push(push)
      }
      // If stack operations were valid, add the successor
      if (!invalidPop) {
        const graphState = new PDAState(
          nextState.id,
          nextState.isFinal,
          lambdaTransition ? '' : symbol,
          lambdaTransition
            ? node.state.remaining
            : node.state.remaining.slice(1),
          nodeStack, // the stack carries forward to each node
          pop,
          push
        )
        const successor = new Node(graphState, node)
        successors.push(successor)
      }
    }
    return successors
  }
}
