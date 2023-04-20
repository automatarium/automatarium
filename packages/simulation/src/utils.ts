import {
  AutomataState,
  BaseAutomataTransition, FSAAutomataTransition, FSAProjectGraph, PDAAutomataTransition, PDAProjectGraph,
  ProjectGraph, ProjectType, TMAutomataTransition, TMProjectGraph
} from 'frontend/src/types/ProjectTypes'
import { expandReadSymbols } from './parseGraph'
import { Graph, Node, State } from './interfaces/graph'
import { PDAGraph, PDAState } from './PDASearch'
import { FSAGraph, FSAState } from './FSASearch'
import { TMGraph, TMState } from './TMSearch'
import { Tape } from './graph'

/**
 * Expands the read symbols in a list of transitions so that they can be used by the simulator
 * @see expandReadSymbols
 */
export const expandTransitions = <T extends BaseAutomataTransition>(transitions: T[]): T[] => {
  return transitions.map(t => ({ ...t, read: expandReadSymbols(t.read) }))
}

/**
 * Returns the initial state object from the graph. Returns undefined if not found
 */
export const findInitialState = (graph: ProjectGraph): AutomataState | undefined => {
  return graph.states.find((state) => state.id === graph.initialState)
}

export interface StateMapping {
  'FSA': FSAState
  'PDA': PDAState
  'TM': TMState
}

export interface TransitionMapping {
  'FSA': FSAAutomataTransition
  'PDA': PDAAutomataTransition
  'TM': TMAutomataTransition
}

export interface ProjectGraphMapping {
  'FSA': FSAProjectGraph
  'PDA': PDAProjectGraph
  'TM': TMProjectGraph
}

export type RestrictedProject<P extends ProjectType> = ProjectGraphMapping[P]

/**
 * Creates a new tape object from an input. The tape is set to start at 0
 */
export const newTape = (input: string): Tape => ({ pointer: 0, trace: input ? input.split('') : [''] })

/**
 * Builds the graph into a problem graph so that it can be simulated
 */
export const buildProblem = <P extends ProjectType, S extends StateMapping[P], T extends TransitionMapping[P]>(graph: RestrictedProject<P>, input: string): Graph<S, T> => {
  // Find what constructors we need to use
  let StateType: new(id: number, isFinal: boolean, ...args: any) => State
  // let StateType: any
  let GraphType: any
  switch (graph.projectType as P) {
    case 'FSA':
      StateType = FSAState
      GraphType = FSAGraph
      break
    case 'PDA':
      StateType = PDAState
      GraphType = PDAGraph
      break
    case 'TM':
      StateType = TMState
      GraphType = TMGraph
      break
  }

  const states = graph.states.map(
    (state) => new StateType(state.id, state.isFinal) as S
  )

  const initialNode = new Node<S>(states.find(n => n.id === graph.initialState))

  if (graph.projectType === 'TM') {
    (initialNode.state as TMState).tape = newTape(input)
  }

  return new GraphType(
    initialNode,
    states,
    // Only FSA and PDA graphs need to have transitions expanded
    (graph.projectType === 'TM' ? graph.transitions : expandTransitions(graph.transitions)) as T[]
  )
}
