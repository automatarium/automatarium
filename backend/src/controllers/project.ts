import { NextFunction, Request, Response } from 'express'

import Project from 'models/project'

export const getProject = async ( req: Request, res: Response, next: NextFunction ) => {
  const { pid } = req.params

  // Retrieve project by id
  try {
    const project = await Project.findById(pid).orFail()
    return res.status(200).json({
      automaton: project
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
}

export const createProject = async ( req: Request, res: Response, next: NextFunction ) => {  
  const { id, userid, isPublic, meta, initialState, states, transitions, comments, tests } = req.body
  
  // Create new project
  const project = new Project({
    _id: id,
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
  try {
    await project.save()
    return res.status(201).json({
      project
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
  // Save project
}