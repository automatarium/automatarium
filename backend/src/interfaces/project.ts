import { Document } from 'mongoose'

import { Comment, Tests, Meta } from 'types'

export default interface IProject extends Document {
  _id: string
  userid: string
  isPublic: boolean
  meta: Meta
  config: object
  initialState: number
  states: object[]
  transitions: object[]
  comments: Comment[]
  tests: Tests
}
