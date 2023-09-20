import { Graph, Node, State } from './interfaces/graph'
import { BaseAutomataTransition } from 'frontend/src/types/ProjectTypes'

export class GraphStepper<S extends State, T extends BaseAutomataTransition> {
  // eslint-disable-next-line no-useless-constructor
  constructor (
        private graph: Graph<S, T>,
        private frontier: Node<S>[] = [graph.initial]
  ) {}

  public forward (): Node<S>[] {
    const frontierCopy = this.frontier.slice()
    this.frontier = []
    while (frontierCopy.length > 0) {
      const node = frontierCopy.shift()
      for (const successor of this.graph.getSuccessors(node)) {
        this.frontier.push(successor)
      }
    }
    return this.frontier
  }

  public backward (): Node<S>[] {
    if (
      this.frontier.length === 1 &&
            this.frontier[0].state.key() === this.graph.initial.state.key()
    ) {
      // This is the root node!
      return this.frontier
    }
    const previousFrontier: Node<S>[] = []
    this.frontier.forEach((node) => {
      if (
        node.parent &&
                !this.checkForDuplicate(node.parent, previousFrontier)
      ) {
        previousFrontier.push(node.parent)
      }
    })
    this.frontier = previousFrontier
    return this.frontier
  }

  private checkForDuplicate (node: Node<S>, frontier: Node<S>[]) {
    return frontier.some((n) => n.state.key() === node.state.key())
  }

  public reset (): Node<S>[] {
    this.frontier = [this.graph.initial]
    return this.frontier
  }

  public canMoveForward (): boolean {
    return this.frontier.some(node => this.graph.getSuccessors(node).length > 0)
  }

  public canMoveBackward (): boolean {
    return this.frontier.some(node => !!node.parent)
  }
}
