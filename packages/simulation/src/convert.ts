import { FSAProjectGraph } from 'frontend/src/types/ProjectTypes'

/**
 * Makes a label for a set of states.
 * States are sorted first e.g. [2, 0, 1] => "0, 1, 2"
 */
const makeStateLabel = (states: number[]): string => {
  return states.sort((a, b) => a - b).join(', ')
}

export const convertNFAtoDFA = (nfa: FSAProjectGraph): FSAProjectGraph => {
  const graphList = new Map<number, Map<string, number[]>>()
  for (const t of nfa.transitions) {
    if (!graphList.has(t.from)) graphList.set(t.from, new Map())
    const forState = graphList.get(t.from)
    if (!forState.has(t.read)) forState.set(t.read, [])
    forState.get(t.read).push(t.to)
  }

  /**
   * Returns all states that can be reached by either reading lambdas or by reading the symbol.
   * The read will only be performed once, but lambdas will always be traversed.
   * This was used instead of `validTransitions` since that doesnt handle transitions like λ -> A -> λ (It should return the last two)
   */
  const explore = (initialStates: number[], read: string): number[] => {
    // Frontier of nodes to explore.
    // canRead is used to track if the symbol has been read yet for a path
    const frontier = initialStates.map(s => ({ canRead: true, state: s }))
    // Store a set of state + read symbol to check we aren't entering a state with a symbol we have used before.
    // We cant just store state since we need to track if we have both seen a state and seen it by already reading
    const seen = new Set<string>()
    const result: number[] = []

    while (frontier.length) {
      const { canRead, state } = frontier.pop()
      const readTable = graphList.get(state)
      // If there are no transitions, ignore
      if (!readTable) continue
      // Helper function to add transitions that are reachable by reading a certain symbol.
      // Sets `canRead` depending on if reading a lambda or not
      const addTransitions = (key: string) => {
        const states = readTable.get(key) || []
        for (const state of states) {
          // The key will be a combo of the state plus if we can read while in that state
          const seenKey = state.toString() + (canRead && key === '')
          if (!seen.has(seenKey)) {
            seen.add(seenKey)
            frontier.push({ canRead: key === '', state })
            if (!canRead || key === read) { result.push(state) }
          }
        }
      }

      // Add states that we can reach by reading the symbol
      if (canRead) {
        addTransitions(read)
      }
      // Add any states we can reach by going through a lambda
      addTransitions('')
    }
    return result
  }

  // Build information about the graph
  const alphabet = new Set(nfa.transitions.map(t => t.read))
  const finalStates = new Set(nfa.states.flatMap(s => s.isFinal ? [s.id] : []))
  // Find position of first node. Doesn't matter really and we should just auto format + zoom to fit
  const initialPos = { x: nfa.states[0].x, y: nfa.states[0].y }
  // Mapping from DFA state label to its ID
  const labelMapping = new Map<string, number>()

  const dfaTable = new Map<string, { read: string, to: string }[]>()
  // Our initial state is any state from the NFA's initial state that we can reach via lambdas
  const dfaInitialStates = explore([nfa.initialState], '').concat(nfa.initialState)
  const frontier: number[][] = [dfaInitialStates]
  const seen = new Set<string>(makeStateLabel(dfaInitialStates))
  // Make a copy of the graph and reset the values so we can make the DFA
  const dfa = structuredClone(nfa)
  dfa.states = []
  dfa.transitions = []
  // Helper to get next ID for item (I am too lazy to ++variable)
  const nextID = (x: {id: number}[]): number => (x[x.length - 1]?.id ?? -1) + 1

  while (frontier.length) {
    const curr = frontier.pop()
    const currKey = makeStateLabel(curr)
    const id = nextID(dfa.states)
    dfa.states.push({
      id,
      label: currKey,
      ...initialPos,
      isFinal: curr.some(s => finalStates.has(s)) // If any of the states are final, then the new state is final
    })
    labelMapping.set(currKey, id)
    // Make sure the table can receive info for it
    dfaTable.set(currKey, [])
    // For every state in the closure, see what states we can be in
    // by trying to read everything in the alphabet
    for (const symbol of alphabet) {
      // Remove lambda transitions
      if (symbol === '') continue

      // Find distinct states we can be in by either reading a lambda or reading the symbol
      const states = Array.from(new Set(explore(curr, symbol)))
      // If we can't reach anything, ignore
      if (states.length === 0) continue
      const key = makeStateLabel(states)
      if (!seen.has(key)) {
        // Make it seen so we don't add it again
        seen.add(key)
        // We will explore it later
        frontier.push(states)
      }
      dfaTable.get(currKey).push({ read: symbol, to: key })
    }
  }
  // Now that the states are all found, we need to add the transitions in
  for (const [label, transitions] of dfaTable) {
    for (const transition of transitions) {
      dfa.transitions.push({
        id: nextID(dfa.transitions),
        from: labelMapping.get(label),
        to: labelMapping.get(transition.to),
        read: transition.read
      })
    }
  }
  return dfa
}

convertNFAtoDFA({
  projectType: 'FSA',
  _id: '48d52bf4-63e4-4129-900a-031d26b9fe56',
  states: [
    {
      x: 465,
      y: 660,
      id: 0,
      isFinal: false
    },
    {
      x: 645,
      y: 660,
      id: 1,
      isFinal: true
    }
  ],
  transitions: [
    {
      from: 0,
      to: 0,
      id: 0,
      read: 'A'
    },
    {
      from: 0,
      to: 1,
      id: 1,
      read: 'A'
    },
    {
      from: 1,
      to: 1,
      id: 2,
      read: 'A'
    }
  ],
  comments: [],
  simResult: [],
  tests: {
    single: '',
    batch: [
      ''
    ]
  },
  initialState: 0,
  meta: {
    name: 'Dull Shed',
    dateCreated: 1686637210665,
    dateEdited: 1686637210665,
    version: '1.0.0',
    automatariumVersion: '1.0.0'
  },
  config: {
    type: 'FSA',
    statePrefix: 'q',
    acceptanceCriteria: 'both',
    color: 'orange'
  }
} as FSAProjectGraph)
