import { FSAGraphIn, FSATransition, StateID, Transition } from './graph'

export type ClosureNode = { transition: Transition, parents: Transition[] }
export type ClosureWithPredicateFn = (transition: FSATransition) => boolean

/**
 * Compute the set of states accessible from a given state using only transitions that meet the conditions
 * as defined by the given predicate.
 *
 * TODO: Have this properly typed using Graph classes. Then transitions and everything will be correct
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
export const closureWithPredicate = (graph: (FSAGraphIn), currentStateID: StateID, predicate: ClosureWithPredicateFn): Set<[StateID, FSATransition[]]> => {
  // Setup flood fill sets
  const closed: ClosureNode[] = []
  const open: ClosureNode[] = graph.transitions
    .filter(tr => tr.from === currentStateID && predicate(tr))
    .map(transition => ({ transition, parents: [] }))

  // Perform flood fill until fully discovered
  while (open.length > 0) {
    // Pop next value to check
    const node = open.pop() as ClosureNode
    closed.push(node)

    // Add neighbouring transitions
    for (const neighbour of graph.transitions.filter(tr => tr.from === node.transition.to && predicate(tr))) {
      if (![...closed, ...open].map(({ transition }) => transition.id).includes(neighbour.id)) {
        // Add neighbour to open set and record the path to it in parents
        open.push({ transition: neighbour, parents: [...node.parents, node.transition] })
      }
    }
  }

  return new Set(closed.map(node => [node.transition.to, [...node.parents as FSATransition[], node.transition as FSATransition]]))
}

export default closureWithPredicate
