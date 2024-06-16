import { Queue } from './collection'
import { Graph, Node, State } from './interfaces/graph'
import { BaseAutomataTransition } from 'frontend/src/types/ProjectTypes'

export const breadthFirstSearch = <S extends State, T extends BaseAutomataTransition>(
  graph: Graph<S, T>
) => {
  const frontier = new Queue<Node<S>>()
  const reached: Map<string, Node<S>> = new Map()

  let node = graph.initial

  frontier.add(node)
  reached.set(node.state.key(), node)

  while (!frontier.isEmpty()) {
    // Bang is necessary because TS doesn't understand that the frontier is not empty here
    node = frontier.remove()
    if (graph.isFinalState(node)) {
      return node
    }
    for (const successor of graph.getSuccessors(node)) {
      if (!reached.has(successor.state.key())) {
        frontier.add(successor)
        reached.set(successor.state.key(), successor)
      }
    }
  }
  return node
}

export const breadthFirstSearchNoPause = <S extends State, T extends BaseAutomataTransition>(
  graph: Graph<S, T>
) => {
  const frontier = new Queue<Node<S>>()
  const reached: Map<string, Node<S>> = new Map()

  let node = graph.initial

  frontier.add(node)
  reached.set(node.state.key(), node)

  while (!frontier.isEmpty()) {
    // Bang is necessary because TS doesn't understand that the frontier is not empty here
    node = frontier.remove()

    for (const successor of graph.getSuccessors(node)) {
      if (!reached.has(successor.state.key())) {
        frontier.add(successor)
        reached.set(successor.state.key(), successor)
      }
    }
  }
  return node
}
