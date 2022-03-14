import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import FiniteStateAutomaton from '../models/finiteStateAutomaton'

export const getFiniteStateAutomaton = ( req: Request, res: Response, next: NextFunction ) => {
  const { fsaid } = req.params

  // Retrieve finite state automaton by id
  FiniteStateAutomaton.findById(fsaid)
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
  const { name, initialState, states, transitions, comments } = req.body

  // Create new finite state automaton
  const finiteStateAutomaton = new FiniteStateAutomaton({
    _id: new mongoose.Types.ObjectId(),
    name,
    initialState,
    states,
    transitions,
    comments
  })

  // Save finite state automaton
  return finiteStateAutomaton.save()
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