import XMLConverter from 'xml-js'

// Define accepted project types
const PROJECT_TYPE_MAP = { fa: 'FSA' }

// Convert JFLAP XML to Automatarium format
export const convertJFLAPXML = xml => {
  const json = XMLConverter.xml2json(xml, { compact: true, ignoreComment: true, ignoreDeclaration: true })
  const jflapProject = JSON.parse(json)
  return convertJFLAPProject(jflapProject)
}

// Convert JFLAP JSON to Automatarium format
export const convertJFLAPProject = jflapProject => {
  // Pull out necessary values from jflap project
  let {
    structure: {
      type,
      automaton: { state: states, transition: transitions, note: notes },
    },
  } = jflapProject

  // Check if format is unsupported
  if (!Object.keys(PROJECT_TYPE_MAP).includes(type._text)) {
    throw new Error(`Unsupported JFLAP project type "${type._text}"!`)
  }

  // Convert attributes to arrays if they are not already
  states = states === undefined ? [] : (Array.isArray(states) ? states : [states])
  transitions = transitions === undefined ? [] : (Array.isArray(transitions) ? transitions : [transitions])
  notes = notes === undefined ? [] : (Array.isArray(notes) ? notes : [notes])

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
    isFinal: state.final !== undefined,
  }))

  // Convert transitions
  const automatariumTransitions = transitions.map((transition, idx) => ({
    id: idx,
    from: Number(transition.from._text),
    to: Number(transition.to._text),
    read: transition.read._text ? transition.read._text : '',
  }))

  // Convert comments
  const automatariumComments = notes.map((note, idx) => ({
    id: idx,
    text: note.text._text,
    x: Number(note.x._text),
    y: Number(note.y._text),
  }))

  return {
    config: {
      type: PROJECT_TYPE_MAP[type._text],
      statePrefix: 'q',
    },
    initialState: initialStateID,
    states: automatariumStates,
    transitions: automatariumTransitions,
    comments: automatariumComments,
  }
}
