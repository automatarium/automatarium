import { NextFunction, Request, Response } from 'express'

import Project from 'models/project'
import { RequestUser } from 'types'

export const getProject = async ( req: Request, res: Response, next: NextFunction ) => {
  const { pid } = req.params
  
  // Retrieve project by id
  try {
    const project = await Project.findById(pid)
    if (!project || project.isPublic || req?.user?.uid == project?.userid) {
      return res.status(200).json({
        project
      })
    }
    return res.status(403).json({
      error: "You do not have access to this project"
    })
  } catch (error) {
    return res.status(500).json({
      error: error?.message ?? error
    })
  }
}

export const createProject = async ( req: Request, res: Response, next: NextFunction ) => {  
  const { id, isPublic, meta, initialState, states, transitions, comments, tests } = req.body
  const { uid } = req.user as RequestUser

  // Create new project
  const project = new Project({
    _id: id,
    userid: uid,
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
    console.log("Heree")
    console.log("Project", project)
    return res.status(201).json({
      project
    })
  } catch (error) {
    console.log("Errorrr", error)
    return res.status(500).json({
      error: error?.message ?? error
    })
  }
  // Save project
}

export const getProjects = async ( req: Request, res: Response, next: NextFunction ) => {
  const { uid } = req.user as RequestUser

  // Retrieve project by id
  try {
    const projects = await Project.find({ userid: uid })
    return res.status(200).json({
      projects
    })
  } catch (error) {
    return res.status(500).json({
      error: error?.message ?? error
    })
  }
}

export const updateProject = async ( req: Request, res: Response, next: NextFunction ) => {
  const { pid } = req.params  
  const { uid } = req.user as RequestUser
  const { isPublic, meta, initialState, states, transitions, comments, tests } = req.body

  try {
    // Update existing project
    const project = await Project.findOneAndUpdate({
      _id: pid
    },
    { 
      userid: uid,
      isPublic,
      meta,
      initialState,
      states,
      transitions,
      comments,
      tests
    }, { useFindAndModify: false })
    return res.status(200).json({
      project
    })
  } catch (error) {
    return res.status(500).json({
      error: error?.message ?? error
    })
  }
}
