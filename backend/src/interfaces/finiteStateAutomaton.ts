import { Document } from 'mongoose'

import { finiteStateAutomatonState, finiteStateAutomatonTransition } from 'types/finiteStateAutomaton'
import { comment } from 'types/main'

export default interface IFiniteStateAutomaton extends Document {
  name: string
  initialState: number
  states: finiteStateAutomatonState[]
  transitions: finiteStateAutomatonTransition[]
  comments: comment[]
}