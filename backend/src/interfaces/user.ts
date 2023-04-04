import { Document } from 'mongoose'

export default interface IUser extends Document {
  _id: string
  email: string
  preferences: object
}
