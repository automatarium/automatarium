export type Comment = {
  id: number
  text: string
  x: number
  y: number
}

export type Tests = {
  trace: string
  batch: string[]
}

export type Meta = {
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
