export type ReadSymbol = string
export type ReadDirection = string
export type StateID = number
export type TransitionID = number

export type State = {
  id: StateID
  isFinal: boolean
}

export type Transition = {
  id: TransitionID
  to: StateID
  from: StateID
  read: ReadSymbol[]
}

export type FSAGraph = {
  initialState: StateID
  states: State[]
  transitions: Transition[]
  [other: string]: unknown
}

export type TMTransition = {
  id: TransitionID
  to: StateID
  from: StateID
  readSymbol: ReadSymbol[]
  readDirection: ReadDirection[]
}

export type UnresolvedTMTransition = {
  id: TransitionID
  to: StateID
  from: StateID
  readSymbol: ReadSymbol
  readDirection: ReadDirection
  [other: string]: unknown
}

export type Tape = {
  trace: ReadSymbol[]
}

export type TMGraph = {
  initialState: StateID
  states: State[]
  transitions: TMTransition[]
  tape: Tape
  [other: string]: unknown
}

export type UnresolvedTMGraph = {
  initialState: StateID
  states: State[]
  transitions: UnresolvedTMTransition[]
  tape: Tape
  [other: string]: unknown
}

export type UnresolvedTransition = {
  id: TransitionID
  to: StateID
  from: StateID
  read: string
  [other: string]: unknown
}

export type UnresolvedFSAGraph = {
  initialState: StateID
  states: State[]
  transitions: UnresolvedTransition[]
  [other: string]: unknown
}

export type ExecutionTrace = {
  read: string | null,
  to: StateID
}

export type ExecutionResult = {
  accepted: boolean
  remaining: string
  trace: ExecutionTrace[]
}
