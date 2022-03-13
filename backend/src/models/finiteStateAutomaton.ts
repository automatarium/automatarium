import mongoose, { Schema } from 'mongoose'

import IFiniteStateAutomaton from 'interfaces/finiteStateAutomaton'

const FiniteStateAutomatonSchema: Schema = new Schema({
  name: { type: String, required: true },
  initialState: { type: Number, required: true },
  states: { type: [{
    id: { type: Number, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    isFinal: { type: Boolean, required: true },
  }], _id: false},
  transitions: { type: [{
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    read: { type: String, required: true },
    bezierControlPoint: { type: [{
      x: { type: Number, required: true }, 
      y: { type: Number, required: true }
    }], required: true, _id: false },
  }], _id: false},
  comments: { type: [{
    id: { type: String, required: true },
    text: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  }], _id: false},
}, { timestamps: true })

export default mongoose.model<IFiniteStateAutomaton>('FiniteStateAutomaton', FiniteStateAutomatonSchema)