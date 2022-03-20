import { Document } from 'mongoose'

import { finiteStateAutomatonState, finiteStateAutomatonTransition } from 'types/finiteStateAutomaton'
import { comment, tests, meta } from 'types/main'

export default interface IFiniteStateAutomaton extends Document {
  meta: meta
  initialState: number
  states: finiteStateAutomatonState[]
  transitions: finiteStateAutomatonTransition[]
  comments: comment[]
  tests: tests
}