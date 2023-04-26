import { StateID } from './graph'
import { BaseAutomataTransition, ProjectGraph } from 'frontend/src/types/ProjectTypes'
import { TransitionMapping } from './utils'

export type ClosureNode<T extends BaseAutomataTransition> = { transition: T, parents: T[] }
export type ClosureWithPredicateFn<T> = (transition: T) => boolean
/**
 * The closure that is returned
 */
type GraphClosure<T> = Set<{state: StateID, transitions: T[]}>

/**
 * Compute the set of states accessible from a given state using only transitions that meet the conditions
 * as defined by the given predicate.
 *
 * @param graph - Graph object used as input
 * @param currentStateID - ID of state used to seed the closure
 * @param predicate - Predicate function
 * @returns A set of pairs where each contains an accessible state and the path of transitions to it.
 * @remark closure will not include starting state
 * @remark closure may include multiple paths to the same state
 *
 * @example Find states accessible using only transitions that read 'A'.
 * ```ts
 * const closure = closureWithPredicate(graph, 0, transition => transition.read.includes('A'))
 * const states = Array.from(closure).map(([state, path]) => state)
 * ```
 *
 * @example Compute lambda closure from a given state.
 * ```ts
 * closureWithPredicate(graph, 0, transition => transition.read.length === 0)
 * ```
 */
export const closureWithPredicate = <P extends ProjectGraph, T extends TransitionMapping<P>>(graph: P, currentStateID: StateID, predicate: ClosureWithPredicateFn<T>): GraphClosure<T> => {
  // Setup flood fill sets
  type CNode = ClosureNode<T>
  const closed: CNode[] = []

  const open = graph.transitions
    .filter((tr: T) => tr.from === currentStateID && predicate(tr))
    .map(transition => ({ transition, parents: [] } as CNode))

  // Perform flood fill until fully discovered
  while (open.length > 0) {
    // Pop next value to check
    const node = open.pop()
    closed.push(node)

    // Add neighbouring transitions
    for (const neighbour of graph.transitions.filter((tr: T) => tr.from === node.transition.to && predicate(tr))) {
      if (![...closed, ...open].map(({ transition }) => transition.id).includes(neighbour.id)) {
        // Add neighbour to open set and record the path to it in parents
        open.push({ transition: neighbour as T, parents: [...node.parents, node.transition] })
      }
    }
  }

  return new Set(closed.map(node => ({
    state: node.transition.to,
    transitions: [...node.parents, node.transition]
  })))
}

export default closureWithPredicate
