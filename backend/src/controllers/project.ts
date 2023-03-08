import { Request, Response } from 'express'

import Project from 'models/project'
import { RequestUser } from 'types'

export const getProject = async ( req: Request, res: Response ) => {
  const { pid } = req.params

  // Retrieve project by id
  try {
    const project = await Project.findById(pid)
    return res.status(200).json({
      project
    })
  } catch (error) {
    return res.status(500).json({
      error: error?.message ?? error
    })
  }
}

export const createProject = async ( req: Request, res: Response ) => {
  const { id, isPublic, meta, initialState, states, transitions, comments, tests, config } = req.body
  const { uid } = req.user as RequestUser

  // Create new project
  const project = new Project({
    _id: id,
    userid: uid,
    isPublic,
    meta,
    config,
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
      error: error?.message ?? error
    })
  }
  // Save project
}

export const getProjects = async ( req: Request, res: Response ) => {
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

export const updateProject = async ( req: Request, res: Response ) => {
  const { pid } = req.params
  const { uid } = req.user as RequestUser
  const { isPublic, meta, initialState, states, transitions, comments, tests, config } = req.body

  try {
    // Update existing project
    const project = await Project.findOneAndUpdate({
      _id: pid,
      userid: uid
    },
    {
      isPublic,
      meta,
      config,
      initialState,
      states,
      transitions,
      comments,
      tests
    }, { useFindAndModify: false, upsert: true, new: true })
    return res.status(200).json({
      project
    })
  } catch (error) {
    return res.status(500).json({
      error: error?.message ?? error
    })
  }
}

export const deleteProject = async ( req: Request, res: Response) => {
  const { pid } = req.params
  const { uid } = req.user as RequestUser

  try {
    const project = await Project.findById(pid)

    // Ensure project belongs to authenticated user
    if (project?.userid !== uid) {
      return res.status(403).json({
        error: 'You cannot delete this project as it does not belong to you.'
      })
    }

    return res.status(200).json()

  } catch (error) {
    return res.status(500).json({
      error: error?.message ?? error
    })
  }
}
