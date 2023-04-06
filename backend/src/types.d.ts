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
  dateCreated: number
  dateEdited: number
  version: string
  automatariumVersion: string
}

export type RequestUser = {
  uid: string
}

declare module 'express-serve-static-core' {
  // eslint-disable-next-line no-unused-vars
  interface Request {
    user?: RequestUser
  }
}
