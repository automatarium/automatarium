/** A coordinate */
export type Point = { x: number, y: number }

/** A record of important variables for a vertex in layouts */
export type Record = {
  /** Coordinate of vertex */
  point: Point
  /** Weight of an edge, signifies the edge's importance */
  omega: number
  /** Adjacency list */
  adjacentList: number[]
}

/** A dictionary of records */
export type Records = {
  [key: number]: Record
}
