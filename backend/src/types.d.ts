export type comment = {
  id: number
  text: string
  x: number
  y: number
}

export type tests = {
  trace: string
  batch: string[]
}

export type meta = {
  name: string
  dateCreated: string
  dateEdited: string
  version: string
  automatariumVersion: string
}

export type RequestUser = {
  uid: string
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: RequestUser
  }
}
