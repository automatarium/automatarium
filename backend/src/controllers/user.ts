import { NextFunction, Request, Response } from 'express'

export const getUser = ( req: Request, res: Response, next: NextFunction) => {
  const { userid } = req.params

  // Retrieve user by id
}