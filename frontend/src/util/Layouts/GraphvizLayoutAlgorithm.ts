/**
 * Implements the algorithm described in [this paper](https://www.graphviz.org/documentation/TSE93.pdf)
 * 'A Technique for Drawing Directed Graphs' by Gansner E.R. et. al.
 */
import { Record, Records } from './types'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'
import { ProjectGraph } from '/src/types/ProjectTypes'

const GraphvizLayoutAlgorithm = (graph: ProjectGraph) => {
  const graphClone = structuredClone(graph)
  const cloneStates = graphClone.states

  // Make graph acyclic
  // Ignore reflexive transitions
  const noReflex = graphClone.transitions.filter(t => !(t.from === t.to))
  // Merge edges and assign weight according to number of transitions
  const edges = new Map<number, [number, number]>()
  for (const t of noReflex) {
    if (edges.has(t.from)) {
      edges.set(t.from, [t.to, edges.get(t.from)[1] + 1])
    } else {
      edges.set(t.from, [t.to, 1])
    }
  }

  // Make graph acyclic

  // Size of bounding box of a node
  const nodeB = [STATE_CIRCLE_RADIUS, STATE_CIRCLE_RADIUS]
  // Minimum horizontal separation
  const nodeSep = 5
  // Minimum vertical separation
  const rankSep = 5

  console.log(`${nodeB}, ${nodeSep}, ${rankSep}`)

  const records = {} as Records

  cloneStates.forEach(v => {
    const adjacentStateIds = []
    for (const t of graphClone.transitions) {
      if (t.from === v.id && !adjacentStateIds.includes(t.to)) {
        adjacentStateIds.push(t.to)
      }
      if (t.to === v.id && !adjacentStateIds.includes(t.from)) {
        adjacentStateIds.push(t.from)
      }
    }
    const r = {
      point: { x: v.x, y: v.y },
      omega: 1,
      adjacentList: adjacentStateIds
    } as Record
    records[v.id] = r
  })

  // rank
  // ordering
  // position

  return graphClone
}

export default GraphvizLayoutAlgorithm
