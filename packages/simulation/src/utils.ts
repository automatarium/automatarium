import {
  AutomataState,
  BaseAutomataTransition,
  FSAAutomataTransition,
  FSAProjectGraph,
  PDAAutomataTransition,
  PDAProjectGraph,
  ProjectGraph,
  TMAutomataTransition,
  TMProjectGraph
} from 'frontend/src/types/ProjectTypes'
import { expandReadSymbols } from './parseGraph'
import { Node } from './interfaces/graph'
import { PDAGraph, PDAState } from './PDASearch'
import { FSAGraph, FSAState } from './FSASearch'
import { TMGraph, TMState } from './TMSearch'
import { Tape } from './graph'
import { GraphStepper } from './Step'

type AutomataProjectGraph = FSAProjectGraph | PDAProjectGraph | TMProjectGraph

type GraphMapper<P extends AutomataProjectGraph, TM, PDA, FSA> =
  P extends TMProjectGraph ? TM :
    P extends PDAProjectGraph ? PDA :
      FSA

export type GraphMapping<P extends AutomataProjectGraph> = GraphMapper<P, TMGraph, PDAGraph, FSAGraph>
export type StateMapping<P extends AutomataProjectGraph> = GraphMapper<P, TMState, PDAState, FSAState>
export type TransitionMapping<P extends AutomataProjectGraph> =
  GraphMapper<P, TMAutomataTransition, PDAAutomataTransition, FSAAutomataTransition>

export const expandTransitions = <T extends BaseAutomataTransition>(transitions: T[]): T[] => {
  return transitions.map(t => {
    if (t.read && t.read.startsWith('!') && t.read.length > 1) {
      return t
    }
    return { ...t, read: expandReadSymbols(t.read ?? '') }
  })
}

export const expandGraph = <T extends AutomataProjectGraph>(graph: T): T => {
  return { ...graph, transitions: expandTransitions(graph.transitions) }
}

export const findInitialState = (graph: AutomataProjectGraph): AutomataState | undefined => {
  return graph.states.find((state) => state.id === graph.initialState)
}

export const newTape = (input: string): Tape => ({ pointer: 0, trace: input ? input.split('') : [''] })

export function buildProblem <M extends AutomataProjectGraph> (graph: M, input: string): GraphMapping<M> | null {
  type S = StateMapping<M>
  type T = TransitionMapping<M>

  let StateType: new(id: number, isFinal: boolean, read?: null, remaining?: string) => S
  let GraphType: new(initial: Node<S>, states: S[], transitions: T[]) => GraphMapping<M>

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
    expandTransitions(graph.transitions) as T[]
  )
}

export const graphStepper = <P extends FSAProjectGraph | PDAProjectGraph | TMProjectGraph>(graph: P, input: string) => {
  const problem = buildProblem(graph, input)
  if (!problem) return null
  return new GraphStepper<StateMapping<P>, TransitionMapping<P>>(problem as any)
}