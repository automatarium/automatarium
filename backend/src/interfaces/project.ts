import { Document } from 'mongoose'

import { comment, tests, meta } from 'types'

export default interface IProject extends Document {
  _id: string
  userid: string
  isPublic: boolean
  meta: meta
  config: object
  initialState: number
  states: object[]
  transitions: object[]
  comments: comment[]
  tests: tests
}