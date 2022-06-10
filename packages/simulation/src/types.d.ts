export type ReadSymbol = string

type StateID = number
type TransitionID = number

type State = {
  id: StateID
  isFinal: boolean
  [other: string]: unknown
}

type Transition = {
  id: TransitionID
  to: StateID
  from: StateID
  read: ReadSymbol[]
  [other: string]: unknown
}

type FSAGraph = {
  initialState: StateID
  states: State[]
  transitions: Transition[]
  [other: string]: unknown
}

type UnresolvedTransition = {
  id: TransitionID
  to: StateID
  from: StateID
  read: string
  [other: string]: unknown
}

type UnresolvedFSAGraph = {
  initialState: StateID
  states: State[]
  transitions: UnresolvedTransition[]
  [other: string]: unknown
}

type ExecutionTrace = {
  read: string | null,
  to: StateID
}

type ExecutionResult = {
  accepted: boolean
  remaining: string
  trace: ExecutionTrace[]
}
