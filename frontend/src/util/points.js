export const lerpPoints = (p1, p2, t) => ({
  x: p1.x + t * (p2.x - p1.x),
  y: p1.y + t * (p2.y - p1.y),
})

export const movePointTowards = (p, tar, d) => {
  const l = size({x: tar.x - p.x, y: tar.y - p.y})
  if (p.x === tar.x && p.y === tar.y)
    return p
  return {
    x: p.x + d * (tar.x - p.x) / l,
    y: p.y + d * (tar.y - p.y) / l,
  }
}

export const size = p =>
  Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2))
