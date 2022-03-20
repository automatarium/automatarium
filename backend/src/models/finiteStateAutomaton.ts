import mongoose, { Schema } from 'mongoose'

import IFiniteStateAutomaton from 'interfaces/finiteStateAutomaton'

const FiniteStateAutomatonSchema: Schema = new Schema({
  meta: {
    type: {
      name: { type: String, required: true },
      automatariumVersion: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    },
    _id: false
  },
  initialState: { type: String, required: true },
  states: { type: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    isFinal: { type: Boolean, required: true },
  }], _id: false},
  transitions: { type: [{
    from: { type: String, required: true },
    to: { type: String, required: true },
    read: { type: String, required: true },
    bezierControlPoint: { type: {
      x: { type: Number, required: true }, 
      y: { type: Number, required: true }
    }, required: true, _id: false },
  }], _id: false},
  comments: { type: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  }], _id: false},
  tests: { type: {
    trace: { type: String, required: true},
    batch: { type: [String], required: true}
  }, _id: false}
}, { versionKey: false })

export default mongoose.model<IFiniteStateAutomaton>('FiniteStateAutomaton', FiniteStateAutomatonSchema)