
export type bezierControlPoint = {
  x: number
  y: number
}

export type comment = {
  id: string
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
  automatariumVersion: string
  createdAt: string
}