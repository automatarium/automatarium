/**
 * Implements the algorithm described in [this paper](https://www.graphviz.org/documentation/TSE93.pdf)
 * 'A Technique for Drawing Directed Graphs' by Gansner E.R. et. al.
 */
import { Record, Records } from './types'
import { STATE_CIRCLE_RADIUS } from 'frontend/src/config/rendering'
import { ProjectGraph } from 'frontend/src/types/ProjectTypes'
import { convertToDAG } from './utils/convertToDAG'

const GraphvizLayoutAlgorithm = (graph: ProjectGraph) => {
  const [dag, edges] = convertToDAG(graph)
  const graphClone = structuredClone(dag)
  const cloneStates = graphClone.states

  // Size of bounding box of a node
  const nodeB = [STATE_CIRCLE_RADIUS, STATE_CIRCLE_RADIUS]
  // Minimum horizontal separation
  const nodeSep = 5
  // Minimum vertical separation
  const rankSep = 5

  console.log(`${nodeB}, ${nodeSep}, ${rankSep}`)
  console.log(edges)

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
