import { ReadSymbol, StateID } from './graph'
import closureWithPredicate from './closureWithPredicate'
import { BaseAutomataTransition, ProjectGraph } from 'frontend/src/types/ProjectTypes'
import { TransitionMapping } from './utils'

export type ValidTransition<T extends BaseAutomataTransition> = { transition: T, trace: { to: number, read: string }[] }

/**
 * Compute the list of transitions that are directly or indirectly navigable from a given starting state using a specific input symbol.
 * Records the "trace" of all requisite transitions so that a trace output can be produced.
 *
 * @param graph - The FSA graph object used as input
 * @param currentStateID - The ID of the current state used to compute the valid transitions
 * @param nextRead  - The input symbol to be read next
 * @returns A list of transitions and the "trace" of states and symbols required to navigate it.
 */
export const validTransitions = <P extends ProjectGraph, T extends TransitionMapping<P>>(graph: P, currentStateID: StateID, nextRead: ReadSymbol): ValidTransition<T>[] => {
  // Compute lambda closure (states accessible without consuming input)
  const closure = Array.from(closureWithPredicate(graph, currentStateID, tr => tr.read.length === 0))

  // Find direct non-lambda transitions
  const directTransitions = graph.transitions
    .filter(transition => transition.from === currentStateID && transition.read.includes(nextRead))
    .map(transition => ({ transition, trace: [] } as ValidTransition<T>))

  // Find transitions from states in lambda closure that we can take
  const indirectTransitions = closure
    .map(({ state, transitions }) => graph.transitions
      .filter(transition => transition.from === state && transition.read.includes(nextRead))
      .map((transition: T) => ({ transition, trace: transitions } as ValidTransition<T>)))
    .reduce((a, b) => [...a, ...b], [])

  // Find transitions to final states in lambda closure
  const finalTransitions = closure
    .filter(({ state }) => graph.states.some(s => s.id === state && s.id !== currentStateID && s.isFinal))
    .map(({ state, transitions }) => ({
      transition: graph.transitions.find(tr => tr.to === state && tr.read.length === 0) as T,
      trace: transitions.slice(0, -1)
    }))

  // Combine transitions
  const allTransitions: ValidTransition<T>[] = [
    ...directTransitions,
    ...indirectTransitions,
    ...finalTransitions
  ]

  // Format trace, add final transition to trace and return
  return allTransitions
    .map(({ transition, trace }) => ({
      transition,
      trace: [...trace, transition].map(tr => ({ to: tr.to, read: tr.read.length === 0 ? '' : nextRead }))
    }))
}
