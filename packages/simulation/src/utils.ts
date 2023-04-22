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
import { GraphStepper } from './Step'

export interface StateMapping {
  'FSA': FSAState
  'PDA': PDAState
  'TM': TMState
}

/**
 * Maps a project type to the transitions that the graph uses.
 * Used in generic function signatures
 */
export interface TransitionMapping {
  'FSA': FSAAutomataTransition
  'PDA': PDAAutomataTransition
  'TM': TMAutomataTransition
}

/**
 * Maps a project type to the full project type.
 * Used by generics for easier restricting (Typescript fails in some situations so we need to do this to help it)
 */
export interface ProjectGraphMapping {
  'FSA': FSAProjectGraph
  'PDA': PDAProjectGraph
  'TM': TMProjectGraph
}

/**
 * A project restricted to a certain graph
 */
export type RestrictedProject<P extends ProjectType> = ProjectGraphMapping[P] & {projectType: P}

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
 * Returns the initial state object from the graph. Returns undefined if not found
 */
export const findInitialState = (graph: ProjectGraph): AutomataState | undefined => {
  return graph.states.find((state) => state.id === graph.initialState)
}

/**
 * Creates a new tape object from an input. The tape is set to start at 0
 */
export const newTape = (input: string): Tape => ({ pointer: 0, trace: input ? input.split('') : [''] })

/**
 * Builds the graph into a problem graph so that it can be simulated
 */
export const buildProblem = <P extends ProjectType>(graph: RestrictedProject<P>, input: string): Graph<StateMapping[P], TransitionMapping[P]> | null => {
  // Find what constructors we need to use
  let StateType: new(id: number, isFinal: boolean, ...args: any) => State
  // let GraphType: new(initialNode: Node<S>, states: S[], transitions: T[]) => Graph<S, T>
  let GraphType: any
  switch (graph.projectType) {
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
    default:
      // This occured during testing, so I have it here to help in future
      console.log(graph)
      throw new Error(`${graph.projectType} is invalid`)
  }

  const initialState = graph.states.find(s => s.id === graph.initialState)
  if (!initialState) {
    return null
  }

  const initialNode = new Node(graph.projectType === 'TM'
    ? new StateType(initialState.id, initialState.isFinal, newTape(input))
    : new StateType(initialState.id, initialState.isFinal, null, input)
  )

  const states = graph.states.map(
    (state) => new StateType(state.id, state.isFinal)
  )

  return new GraphType(
    initialNode,
    states,
    // Only FSA and PDA graphs need to have transitions expanded
    // This should've been done by the frontend but we do it here just encase
    (graph.projectType === 'TM' ? graph.transitions : expandTransitions(graph.transitions))
  )
}

export const graphStepper = <P extends ('FSA' | 'PDA')>(graph: RestrictedProject<P>, input: string): GraphStepper<StateMapping[P], TransitionMapping[P]> | null => {
  const problem = buildProblem(graph, input)
  if (!problem) return null
  return new GraphStepper(problem)
}
