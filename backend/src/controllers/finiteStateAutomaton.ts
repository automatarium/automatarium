import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import FiniteStateAutomaton from '../models/finiteStateAutomaton'

export const getFiniteStateAutomaton = ( req: Request, res: Response, next: NextFunction ) => {
  const { faid } = req.params

  FiniteStateAutomaton.findById(faid)
    .exec()
    .then((result) => {
      return res.status(200).json({
        automaton: result
      })
    }).catch((error) => {
      return res.status(500).json({
        message: error.message,
        error
      })
    })
}

export const createFiniteStateAutomaton = ( req: Request, res: Response, next: NextFunction ) => {
  console.log(req.body)
  
  const { name, initialState, states, transitions, comments } = req.body

  const finiteAutomaton = new FiniteStateAutomaton({
    _id: new mongoose.Types.ObjectId(),
    name,
    initialState,
    states,
    transitions,
    comments
  })

  return finiteAutomaton.save()
    .then( (result) => {
      return res.status(201).json({
        automaton: result
      })
    }).catch((error) => {
      return res.status(500).json({
        message: error.message,
        error
      })
    })
}