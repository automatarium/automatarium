import { GRID_SNAP } from '/src/config/interactions'
import { Coordinate } from '/src/types/ProjectTypes'

export const lerpPoints = (p1: Coordinate, p2: Coordinate, t: number) => ({
  x: p1.x + t * (p2.x - p1.x),
  y: p1.y + t * (p2.y - p1.y)
})

export const movePointTowards = (p: Coordinate, tar: Coordinate, d: number): Coordinate => {
  const l = size({ x: tar.x - p.x, y: tar.y - p.y })
  if (p.x === tar.x && p.y === tar.y) { return p }
  return {
    x: p.x + d * (tar.x - p.x) / l,
    y: p.y + d * (tar.y - p.y) / l
  }
}

export const size = (p: Coordinate): number =>
  Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2))

export const snapPosition = (p: Coordinate): Coordinate =>
  ({ x: Math.floor(p.x / GRID_SNAP) * GRID_SNAP, y: Math.floor(p.y / GRID_SNAP) * GRID_SNAP })
