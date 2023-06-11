import {
  BaseAutomataTransition, FSAAutomataTransition, PDAAutomataTransition, PDAProjectGraph,
  ProjectGraph, TMAutomataTransition, TMProjectGraph
} from 'frontend/src/types/ProjectTypes'
import { expandReadSymbols } from './parseGraph'
import { Node } from './interfaces/graph'
import { PDAGraph, PDAState } from './PDASearch'
import { FSAGraph, FSAState } from './FSASearch'
import { TMGraph, TMState } from './TMSearch'
import { Tape } from './graph'
import { GraphStepper } from './Step'

/**
 * Utility type for mapping a ProjectGraph to something else.
 * This is needed because normal graph mapping just produced a union which meant the type inference only
 * produced a union instead of a certain type.
 * e.g. buildProblem({} as TMProjectGraph, '') would be TMGraph | PDAGraph | FSAGraph instead of TMGraph.
 * Hopefully this problem is fixed in future typescript versions
 */
type GraphMapper<P extends ProjectGraph, TM, PDA, FSA> =
  P extends TMProjectGraph ? TM :
    P extends PDAProjectGraph ? PDA :
      FSA

/**
 * Mapping of frontend graph -> simulator graph
 */
export type GraphMapping<P extends ProjectGraph> = GraphMapper<P, TMGraph, PDAGraph, FSAGraph>
/**
 * Mapping of frontend graph -> simulator state
 */
export type StateMapping<P extends ProjectGraph> = GraphMapper<P, TMState, PDAState, FSAState>
/**
 * Mapping of frontend graph -> its transition type.
 */
export type TransitionMapping<P extends ProjectGraph> =
  GraphMapper<P, TMAutomataTransition, PDAAutomataTransition, FSAAutomataTransition>

/**
 * Expands the read symbols in a list of transitions so that they can be used by the simulator
 * @see expandReadSymbols
 */
export const expandTransitions = <T extends BaseAutomataTransition>(transitions: T[]): T[] => {
  return transitions.map(t => ({ ...t, read: expandReadSymbols(t.read ?? '') }))
}

/**
 * Performs any expansions needed for a graph (i.e. expands any transitions if its a FSA/PDA graph)
 */
export const expandGraph = <T extends ProjectGraph>(graph: T): T => {
  if (['FSA', 'PDA'].includes(graph.projectType)) {
    return { ...graph, transitions: expandTransitions(graph.transitions) }
  }
  return graph
}
/**
 * Creates a new tape object from an input. The tape is set to start at 0
 */
export const newTape = (input: string): Tape => ({ pointer: 0, trace: input ? input.split('') : [''] })

/**
 * Builds the graph into a problem graph so that it can be simulated
 */
export function buildProblem <M extends ProjectGraph> (graph: M, input: string): GraphMapping<M> | null {
  // Make some type aliases
  type S = StateMapping<M>
  type T = TransitionMapping<M>

  let StateType: new(id: number, isFinal: boolean, read?: null, remaining?: string) => S
  let GraphType: new(initial: Node<S>, states: S[], transitions: T[]) => GraphMapping<M>
  // Find which constructor is needed.
  // Due to typescript weirdness this needs to be done like this (Hopefully can be changed in future)
  switch (graph.projectType) {
    case 'FSA':
      StateType = FSAState as typeof StateType
      GraphType = FSAGraph as typeof GraphType
      break
    case 'PDA':
      StateType = PDAState as typeof StateType
      GraphType = PDAGraph as typeof GraphType
      break
    case 'TM':
      StateType = TMState as typeof StateType
      GraphType = TMGraph as typeof GraphType
      break
  }

  const initialState = graph.states.find(s => s.id === graph.initialState)
  if (!initialState) {
    return null
  }

  const initialNode = new Node(graph.projectType === 'TM'
    ? new TMState(initialState.id, initialState.isFinal, newTape(input))
    : new StateType(initialState.id, initialState.isFinal, null, input)
  ) as Node<S>

  const states = graph.states.map(
    state => new StateType(state.id, state.isFinal)
  )

  return new GraphType(
    initialNode,
    states,
    // Only FSA and PDA graphs need to have transitions expanded
    // This should've been done by the frontend, but we do it here just encase
    (graph.projectType === 'TM' ? graph.transitions : expandTransitions(graph.transitions)) as T[]
  )
}

/**
 * Creates a GraphStepper for stepping through how a frontend graph simulates an input
 * @see GraphStepper
 */
export const graphStepper = <P extends ProjectGraph>(graph: P, input: string) => {
  const problem: GraphMapping<P> = buildProblem(graph, input)
  if (!problem) return null
  // We know that problem is PDAGraph | FSAGraph so this is safe
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new GraphStepper<StateMapping<P>, TransitionMapping<P>>(problem as any)
}
