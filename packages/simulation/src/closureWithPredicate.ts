import { FSAGraph, StateID, Transition } from './types'

export type ClosureNode = { transition: Transition, parents: Transition[] }
export type ClosureWithPredicateFn = (transition: Transition) => boolean

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
export const closureWithPredicate = (graph: (FSAGraph), currentStateID: StateID, predicate: ClosureWithPredicateFn): Set<[StateID, Transition[]]> => {
  // Setup flood fill sets
  let closed: ClosureNode[] = []
  let open: ClosureNode[] = graph.transitions
    .filter(tr => tr.from === currentStateID && predicate(tr))
    .map(transition => ({ transition, parents: [] }))

  // Perform flood fill until fully discovered
  while (open.length > 0) {
    // Pop next value to check
    let node = open.pop() as ClosureNode
    closed.push(node)

    // Add neighbouring transitions
    for (let neighbour of graph.transitions.filter(tr => tr.from === node.transition.to && predicate(tr))) {
      if (![...closed, ...open].map(({ transition }) => transition.id).includes(neighbour.id)) {
        // Add neighbour to open set and record the path to it in parents
        open.push({ transition: neighbour, parents: [...node.parents, node.transition] })
      }
    }
  }

  return new Set(closed.map(node => [node.transition.to, [...node.parents, node.transition]]))
}

export default closureWithPredicate
