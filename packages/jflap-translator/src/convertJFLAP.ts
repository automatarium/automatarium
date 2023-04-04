
// Define accepted project types
import { xml2json } from 'xml-js'

import { DEFAULT_PROJECT_COLOR } from 'frontend/src/config'

const PROJECT_TYPE_MAP = {
  fa: 'FSA',
  pda: 'PDA',
  turing: 'TM'
}

export type GraphConfig = {
  type: 'FSA' | 'tm' | 'pda'
  statePrefix: string
  color: string
}

/**
 * Basic transition that stores common properties of other transition types
 */
export type Transition = {
  id: number
  from: number
  to: number
  read: string
}

export type PDATransition = Transition & {
  push: string
  pop: string
}

export type TMTransition = Transition & {
  write: string
  direction: string
}

/**
 * Stores a state in a graph. Modeled after the frontend
 */
export type State = {
  id: number
  name: string
  label: string
  x: number
  y: number
  isFinal: boolean
}

/**
 * Comment that is placed somewhere on the project
 */
export type Comment = {
  id: number
  x: number
  y: number
  text: string
}

// TODO: Replace with whatever type the frontenders come up with for the typescript conversion
/**
 * Stores data about a graph. This models how it is stored in the frontend
 */
export type FrontendGraph = {
  config: GraphConfig
  initialState: number
  states: State[]
  transitions: Transition[]
  comments: Comment[]
}

// Convert JFLAP XML to Automatarium format
export const convertJFLAPXML = (xml: string): FrontendGraph => {
  const json = xml2json(xml, { compact: true, ignoreComment: true, ignoreDeclaration: true })
  const jflapProject = JSON.parse(json)
  return convertJFLAPProject(jflapProject)
}

// Convert JFLAP JSON to Automatarium format
export const convertJFLAPProject = (jflapProject: any): FrontendGraph => {
  // Pull out necessary values from jflap project
  let {
    structure: {
      type,
      automaton: { state: states, transition: transitions, note: notes }
    }
  } = jflapProject
  const projectType = PROJECT_TYPE_MAP[type._text]

  // Check if format is unsupported
  if (!Object.keys(PROJECT_TYPE_MAP).includes(type._text)) {
    throw new Error(`Unsupported JFLAP project type "${type._text}"!`)
  }

  // Convert attributes to arrays if they are not already
  const toArray = (x: any[]) => x === undefined ? [] : (Array.isArray(x) ? x : [x])
  states = toArray(states)
  transitions = toArray(transitions)
  notes = toArray(notes)

  // Find initial state
  const initialState = states.find(s => s.initial)
  const initialStateID = Number(initialState._attributes.id)

  // Convert states
  const automatariumStates = states.map(state => ({
    id: Number(state._attributes.id),
    name: state._attributes.name,
    label: state.label ? state.label._text : '',
    x: Number(state.x._text),
    y: Number(state.y._text),
    isFinal: state.final !== undefined
  }))

  // Convert transitions
  const automatariumTransitions = transitions.map((transition, idx) => {
    const convTrans = {
      id: idx,
      from: Number(transition.from._text),
      to: Number(transition.to._text),
      read: transition.read._text ? transition.read._text : ''
    }
    // Add any extra fields if needed
    if (projectType === 'PDA') {
      // Copy is needed to please type checker
      const pdaTrans = convTrans as PDATransition
      pdaTrans.push = transition.push._text ?? ''
      pdaTrans.pop = transition.pop._text ?? ''
      // We don't support multi character input at the moment
      if (pdaTrans.push.length > 1 || pdaTrans.pop.length > 1) {
        throw new Error("Automatarium doesn't support multi character input")
      }
      return pdaTrans
    } else if (projectType === 'TM') {
      const tmTrans = convTrans as TMTransition
      tmTrans.write = transition.write._text ?? ''
      tmTrans.direction = transition.move._text ?? ''
      return tmTrans
    } else {
      return convTrans
    }
  })

  // Convert comments
  const automatariumComments = notes.map((note, idx) => ({
    id: idx,
    text: note.text._text,
    x: Number(note.x._text),
    y: Number(note.y._text)
  }))

  return {
    config: {
      type: projectType,
      statePrefix: 'q',
      color: DEFAULT_PROJECT_COLOR[projectType]
    },
    initialState: initialStateID,
    states: automatariumStates,
    transitions: automatariumTransitions,
    comments: automatariumComments
  }
}
