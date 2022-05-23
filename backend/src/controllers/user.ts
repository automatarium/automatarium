import { NextFunction, Request, Response } from 'express'

import User from 'models/user'
import { RequestUser } from 'types'

export const getUser = async ( req: Request, res: Response, next: NextFunction ) => {
  const { uid } = req.user as RequestUser

  // Retrieve user by id
  try {
    const user = await User.findById(uid)
    return res.status(200).json({
      user
    })
  } catch (error) {
    return res.status(500).json({
      error: error?.message ?? error
    })
  }
}

export const createUser = async ( req: Request, res: Response, next: NextFunction ) => {  
  const { uid, email, preferences } = req.body
  
  // Create new user
  const user = new User({
    _id: uid,
    email,
    preferences
  })

  // Save user
  try {
    await user.save()
    return res.status(201).json({
      user
    })
  } catch (error) {
    return res.status(500).json({
      error: error?.message ?? error
    })
  }
}
