import mongoose, { Schema } from 'mongoose'

import IUser from 'interfaces/user'

const UserSchema: Schema = new Schema({
  _id: { type: String, required: true},
  email: { type: String, required: true},
  preferences: { type: Object, required: true }
}, { versionKey: false, _id: false })

export default mongoose.model<IUser>('User', UserSchema)