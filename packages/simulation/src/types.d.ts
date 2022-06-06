export type ReadSymbol = string

type StateID = number

type State = {
  id: StateID
  isFinal: boolean
  [other: string]: unknown
}

type Transition = {
  to: StateID,
  from: StateID,
  read: ReadSymbol[],
  [other: string]: unknown
}

type FSAGraph = {
  initialState: StateID,
  states: State[],
  transitions: Transition[],
  [other: string]: unknown
}

type UnresolvedTransition = {
  to: StateID,
  from: StateID,
  read: string
  [other: string]: unknown
}

type UnresolvedFSAGraph = {
  initialState: StateID,
  states: State[],
  transitions: UnresolvedTransition[],
}
