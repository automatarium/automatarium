import { NextFunction, Request, Response } from 'express'

import User from 'models/user'

export const getUser = async ( req: Request, res: Response, next: NextFunction ) => {
  const { uid } = req.params

  // Retrieve user by id
  try {
    const user = await User.findById(uid).orFail()
    return res.status(200).json({
      user
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error
    })
  }
}

export const createUser = async ( req: Request, res: Response, next: NextFunction ) => {  
  const { email, preferences } = req.body
  
  console.log(email)
  // Create new user
  const user = new User({
    _id: '1',
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
      message: error.message,
      error
    })
  }
}