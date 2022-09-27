import {FSAGraph, StateID, ReadSymbol, Transition, TMTransition, TMGraph} from './types.d'
import closureWithPredicateTM from './closureWithPredicateTM'

export type ValidTMTransition = { transition: TMTransition, trace: { to: number, read: string }[]}

/**
 * Compute the list of transitions that are directly or indirectly navigable from a given starting state using a specific input symbol.
 * Records the "trace" of all requisite transitions so that a trace output can be produced.
 *
 * TO DO. IN DEVELOPMENT TO MOVE FROM FSA TO TM
 *
 * @param graph - The TM graph object used as input
 * @param currentStateID - The ID of the current state used to compute the valid transitions
 * @param nextRead  - The input symbol to be read next
 * @returns A list of transitions and the "trace" of states and symbols required to navigate it.
 */
export const validTMTransitions = (graph: TMGraph, currentStateID: StateID, nextRead: ReadSymbol): ValidTMTransition[] => {
  // Compute lambda closure (states accessible without consuming input)
  // const closure = Array.from(closureWithPredicateTM(graph, currentStateID, tr => tr.readSymbol.length === 0))

  // Find direct non-lambda transitions
  const directTransitions = graph.transitions
    .filter(transition => transition.from === currentStateID &&
                         transition.readSymbol.some(symbol => symbol === nextRead))
    .map(transition => ({ transition, trace: [] }))

  // Find transitions from states in lambda closure that we can take
  // const indirectTransitions = closure
  //   .map(([stateID, precedingTransitions]) => graph.transitions
  //     .filter(transition => transition.from === stateID &&
  //                          transition.readSymbol.some(symbol => symbol === nextRead))
  //     .map(transition => ({ transition, trace: precedingTransitions })))
  //   .reduce((a, b) => [...a, ...b], [])

  // Find transitions to final states in lambda closure
  // const finalTransitions = closure
  //   .filter(([stateID]) => graph.states.some(s => s.id === stateID && s.id !== currentStateID && s.isFinal))
  //   .map(([stateID, precedingTransitions]) => ({
  //     transition: (graph.transitions.find(tr => tr.to === stateID && tr.readSymbol.length === 0) as TMTransition),
  //     trace: precedingTransitions.slice(0, -1),
  //   }))

  // Combine transitions
  const allTransitions = [
    ...directTransitions//,
    // ...indirectTransitions,
    // ...finalTransitions,
  ]

  // Format trace, add final transition to trace and return
  return allTransitions
    .map(({transition, trace }) => ({
      transition,
        //I think below is where I need to add directionality. Not just jump to next read.
      trace: [...trace, transition].map(tr => ({ to: tr.to, read: tr.readSymbol.length === 0 ? '' : nextRead }))
    }))
}
