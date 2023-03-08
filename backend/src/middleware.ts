import { NextFunction, Request, Response } from 'express'

import admin from 'firebaseAdmin'

export const decodeToken = async (req: Request, res: Response, next: NextFunction) => {
  // Expect a token
  const header = req.headers.authorization

  if (!header || header === 'Bearer null' || !header.startsWith('Bearer '))
    return next()

  // Decode token
  const idToken = header.replace('Bearer ', '')

  // Verify token
  try {
    const userInfo = await admin.auth().verifyIdToken(idToken)
    req.user = userInfo
  } catch ({ message }) {
    return res.status(500).json({
      error: message,
    })
  }

  return next()
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return next()
  }
  return res.status(403).json({
    error: 'User must be authenticated'
  })
}
