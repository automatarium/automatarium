/**
 * Taking this from the JFLAP source code
 */

import { AutomataState, ProjectGraph } from '/src/types/ProjectTypes'

type Point = { x: number, y: number }

interface Record {
  point: Point
  temperature: 4.0
  numAdjacent: number
}

interface Records {
  [key: number]: Record
}

const GemLayoutAlgorithm = (graph: ProjectGraph) => {
  const vArray = graph.states
  const c = [0.0, 0.0]
  const records = {} as Records

  vArray.forEach(v => {
    const r = {
      point: { x: v.x, y: v.y },
      temperature: 4,
      numAdjacent: graph.transitions.filter(t => t.from === v.id || t.to === v.id).length
    } as Record
    c[0] += r.point.x
    c[1] += r.point.y
    records[v.id] = r
  })

  const rMax = 120 * vArray.length

  const gravitationalConstant = 1.0 / 16.0
  const optimalEdgeLength = 200.0
  const o2 = optimalEdgeLength ** 2

  // Iterate until done
  let vertices = [] as AutomataState[]
  for (let i = 0; i < rMax; ++i) {
    if (vertices.length === 0) {
      vertices = [...vArray]
      if (vertices.length === 0) {
        return
      }
    }

    // Chose a vertex
    const index = Math.floor(Math.random() * vertices.length)
    const vertex = vertices.splice(index, 1)[0]
    const vRecord = records[vertex.id]
    const point = vRecord.point

    // Compute impulse
    const theta = vRecord.numAdjacent * (1.0 + vRecord.numAdjacent / 2.0)
    const p = [
      (c[0] / vArray.length - point.x) * gravitationalConstant * theta,
      (c[1] / vArray.length - point.y) * gravitationalConstant * theta
    ]

    // Random disturbance
    p[0] += Math.random() * 10.0 - 5.0
    p[1] += Math.random() * 10.0 - 5.0
    // Forces exerted by other nodes
    for (let j = 0; j < vArray.length; ++j) {
      const otherVertex = vArray[j]
      if (otherVertex === vertex) { continue }
      const otherPoint = { x: otherVertex.x, y: otherVertex.y } as Point
      const delta = [point.x - otherPoint.x, point.y - otherPoint.y]
      // Nudge state so they will separate
      if (delta[0] === 0 && delta[1] === 0) {
        delta[0] += 1
        delta[1] += 1
      }
      const d2 = delta[0] ** 2 + delta[1] ** 2
      if (delta[0] !== 0.0 || delta[1] !== 0.0) {
        p[0] += delta[0] * o2 / d2
        p[1] += delta[1] * o2 / d2
      }
      // Is adjacent?
      if (!graph.transitions.some(t => (t.from === vertex.id && t.to === otherVertex.id) || (t.from === otherVertex.id && t.to === vertex.id))) {
        continue
      }
      p[0] -= delta[0] * d2 / (o2 * theta)
      p[1] -= delta[1] * d2 / (o2 * theta)
    }

    // Adjust position and temperature
    if (p[0] !== 0.0 || p[1] !== 0.0) {
      const absp = Math.sqrt(Math.abs(p[0] ** 2 + p[1] ** 2))
      p[1] *= vRecord.temperature / absp
      p[0] *= vRecord.temperature / absp
      // Update position
      vArray[index].x += p[0]
      vArray[index].y += p[1]
      // Update barycenter
      c[0] += p[0]
      c[1] += p[1]
    }
  }
  return graph
}

export default GemLayoutAlgorithm
