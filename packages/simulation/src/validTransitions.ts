import { FSAGraphIn, FSATransition, ReadSymbol, StateID, Transition } from './graph'
import closureWithPredicate from './closureWithPredicate'

export type ValidTransition = { transition: Transition, trace: { to: number, read: string }[]}

/**
 * Compute the list of transitions that are directly or indirectly navigable from a given starting state using a specific input symbol.
 * Records the "trace" of all requisite transitions so that a trace output can be produced.
 *
 * @param graph - The FSA graph object used as input
 * @param currentStateID - The ID of the current state used to compute the valid transitions
 * @param nextRead  - The input symbol to be read next
 * @returns A list of transitions and the "trace" of states and symbols required to navigate it.
 */
export const validTransitions = (graph: FSAGraphIn, currentStateID: StateID, nextRead: ReadSymbol): ValidTransition[] => {
  // Compute lambda closure (states accessible without consuming input)
  const closure = Array.from(closureWithPredicate(graph, currentStateID, tr => (tr as FSATransition).read.length === 0))

  // Find direct non-lambda transitions
  const directTransitions = graph.transitions
    .filter(transition => transition.from === currentStateID &&
                         transition.read.some(symbol => symbol === nextRead))
    .map(transition => ({ transition, trace: [] }))

  // Find transitions from states in lambda closure that we can take
  const indirectTransitions = closure
    .map(([stateID, precedingTransitions]) => graph.transitions
      .filter(transition => transition.from === stateID &&
                           transition.read.some(symbol => symbol === nextRead))
      .map(transition => ({ transition, trace: precedingTransitions })))
    .reduce((a, b) => [...a, ...b], [])

  // Find transitions to final states in lambda closure
  const finalTransitions = closure
    .filter(([stateID]) => graph.states.some(s => s.id === stateID && s.id !== currentStateID && s.isFinal))
    .map(([stateID, precedingTransitions]) => ({
      transition: (graph.transitions.find(tr => tr.to === stateID && tr.read.length === 0) as Transition),
      trace: precedingTransitions.slice(0, -1)
    }))

  // Combine transitions
  const allTransitions = [
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
