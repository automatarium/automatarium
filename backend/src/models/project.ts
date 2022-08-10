import mongoose, { Schema } from 'mongoose'

import IProject from 'interfaces/project'

const ProjectSchema: Schema = new Schema({
  _id: { type: String, required: true },
  userid: { type: String, required: true },
  isPublic: { type: Boolean, required: true },
  meta: {
    type: {
      name: { type: String, required: true },
      dateCreated: { type: Number, required: true },
      dateEdited: { type: Number, required: true },
      version: { type: String, required: true },
      automatariumVersion: { type: String, required: true },
    },
    _id: false
  },
  config: { type: Object },
  initialState: { type: Number, required: true },
  states: { type: Object, _id: false },
  transitions: { type: Object, _id: false },
  comments: { type: [{
    id: { type: Number, required: true },
    text: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  }], _id: false},
  tests: { type: {
    trace: { type: String, required: true },
    batch: { type: [String], required: true }
  }, _id: false}
}, { versionKey: false, _id: false })

export default mongoose.model<IProject>('Project', ProjectSchema)
