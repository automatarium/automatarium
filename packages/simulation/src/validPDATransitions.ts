import {PDAGraph, StateID, ReadSymbol, PDATransition, PopSymbol, PushSymbol, Stack} from './types.d'
import closureWithPredicate from './closureWithPredicate'

export type ValidPDATransition = { transition: PDATransition, trace: { to: number, read: string, pop:string, push:string }[]}

/**
 * Compute the list of transitions that are directly or indirectly navigable from a given starting state using a specific input symbol.
 * Records the "trace" of all requisite transitions so that a trace output can be produced.
 *
 * TO DO. IN DEVELOPMENT TO MOVE FROM FSA TO PDA
 *
 * @param graph - The PDA graph object used as input
 * @param currentStateID - The ID of the current state used to compute the valid transitions
 * @param nextRead  - The input symbol to be read next
 * @param stack - The PDA stack
 * @returns A list of transitions and the "trace" of states and symbols required to navigate it.
 */
export const validPDATransitions = (graph: PDAGraph, currentStateID: StateID, 
    nextRead: ReadSymbol): ValidPDATransition[] => {
  // Compute lambda closure (states accessible without consuming input)
  const closure = Array.from(closureWithPredicate(graph, currentStateID, tr => tr.read.length === 0))

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
      transition: (graph.transitions.find(tr => tr.to === stateID && tr.read.length === 0) as PDATransition),
      trace: precedingTransitions.slice(0, -1),
    }))

  // Combine transitions
  const allTransitions = [
    ...directTransitions,
    ...indirectTransitions,
    ...finalTransitions,
  ]

  // Format trace, add final transition to trace and return
  return allTransitions
    .map(({ transition, trace }) => ({
      transition,
      trace: [...trace, transition].map(tr => ({ to: tr.to, read: tr.read.length === 0 ? '' : nextRead }))
    }))
}