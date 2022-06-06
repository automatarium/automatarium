import { FSAGraph, StateID, ReadSymbol, Transition } from './types'

type ValidTransition = { transition: Transition, trace: { to: number, read: string }[]}
type ClosureNode = { transition: Transition, parents: Transition[] }

// Return transitions that are directly or indirectly navigable from the current state given a specific input
// we return those transitions along with a "trace" list of necessary prior (lambda) transitions
// the transitions in "trace" are recorded for the sake of producing trace output but can otherwise be disregarded
const validTransitions = (graph: FSAGraph, currentStateID: StateID, nextRead: ReadSymbol): ValidTransition[] => {
  // Compute lambda closure (states accessible without consuming input)
  const closure = Array.from(lambdaClosure(graph, currentStateID))

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

  // Combine transitions
  const allTransitions = [
    ...directTransitions,
    ...indirectTransitions,
  ]

  // Format trace, add final transition to trace and return
  return allTransitions
    .map(({ transition, trace }) => ({
      transition,
      trace: [...trace, transition].map(tr => ({ to: tr.to, read: tr.read.length === 0 ? '' : nextRead }))
    }))
}

// Compute states accessible from given state without consuming input
// i.e accessible only by navigating lambda transitions
// we return those states along with a path of transitions to get there
const lambdaClosure = (graph: FSAGraph, currentStateID: StateID): Set<[StateID, Transition[]]> => {
  // Setup flood fill sets
  let closed: ClosureNode[] = []
  let open: ClosureNode[] = graph.transitions
    .filter(tr => tr.from === currentStateID && tr.read.length === 0)
    .map(transition => ({ transition, parents: [] }))

  // Perform flood fill until fully discovered
  while (open.length > 0) {
    // Pop next value to check
    let node = open.pop()
    closed.push(node)

    // Add neighbouring lambda transitions
    for (let neighbour of graph.transitions.filter(tr => tr.from === node.transition.to && tr.read.length === 0)) {
      if (![...closed, ...open].map(({ transition }) => transition.id).includes(neighbour.id)) {
        // Add neighbour to open set and record the path to it in parents
        open.push({ transition: neighbour, parents: [...node.parents, node.transition] })
      }
    }
  }

  return new Set(closed.map(node => [node.transition.to, [...node.parents, node.transition]]))
}

export default validTransitions
