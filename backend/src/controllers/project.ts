import { NextFunction, Request, Response } from 'express'

import Project from '../models/project'

export const getProject = ( req: Request, res: Response, next: NextFunction ) => {
  const { pid } = req.params

  // Retrieve project by id
  Project.findById(pid)
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

export const createProject = ( req: Request, res: Response, next: NextFunction ) => {  
  const { id, userid, isPublic, meta, initialState, states, transitions, comments, tests } = req.body
  
  // Create new project
  const project = new Project({
    id,
    userid,
    isPublic,
    meta,
    initialState,
    states,
    transitions,
    comments,
    tests
  })

  // Save project
  return project.save()
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