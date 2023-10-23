/**
 * Implements the algorithm described in [this paper](https://www.graphviz.org/documentation/TSE93.pdf)
 * 'A Technique for Drawing Directed Graphs' by Gansner E.R. et. al.
 */
import { Record, Records } from './types'
import { STATE_CIRCLE_RADIUS } from 'frontend/src/config/rendering'
import { ProjectGraph } from 'frontend/src/types/ProjectTypes'
import { AdjacencyList, convertToDAG } from './utils/convertToDAG'

type Node = {
  id: number
  x: number
  y: number
  weight: number
  parent: Node
  children: Node[]
}

type Level = {
  nodes: Node[]
  next: Level
  gravity: number
  min: number
  max: number
}

const GraphvizLayoutAlgorithm = (graph: ProjectGraph) => {
  const [dag, edges] = convertToDAG(graph)
  const graphClone = structuredClone(graph)
  const cloneStates = graphClone.states

  const MAX_ITERATIONS = 100

  // Size of bounding box of a node
  const nodeB = [STATE_CIRCLE_RADIUS, STATE_CIRCLE_RADIUS]
  // Minimum horizontal separation
  const nodeSep = 5
  // Minimum vertical separation
  const rankSep = 5

  console.log(`My DAG ${dag}`)

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
  // TODO: Currently just creates a tree from the graph. Needs to be ranked properly wrt. to importance etc.
  const hierarchy = (graph: ProjectGraph, edges: AdjacencyList) : Level => {
    const { states } = graph

    const getSuccessors = (parent: Node, edges: AdjacencyList) : Node[] => {
      const adj = edges.get(parent.id)
      if (!adj) { return [] }
      const sortedNodes = adj
        .toSorted((a, b) => a.weight + b.weight) // Descending
        .map(a => {
          const state = states.find(s => s.id === a.id)
          const node = {
            id: state.id,
            x: state.x,
            y: state.y,
            weight: a.weight,
            parent
          } as Node
          node.children = getSuccessors(node, edges)
          return node
        })
      return sortedNodes
    }

    const constructLevels = (base: Level) => {
      if (base.nodes.length < 1) { return }
      const nextLevel = { nodes: base.nodes.flatMap(n => n.children), next: null, gravity: 0, min: 0, max: 0 }
      base.next = nextLevel
      constructLevels(nextLevel)
    }

    const constructTree = (edges: AdjacencyList) : Level => {
      // Find root, source or node with the highest out degrees
      const rootNode = graph.initialState
        ? states.find(s => s.id === graph.initialState)
        : (() => states[0])() // TODO: Actual out degree calculation
      const node = {
        id: rootNode.id,
        x: rootNode.x,
        y: rootNode.y,
        weight: 1,
        parent: null
      } as Node
      node.children = getSuccessors(node, edges)
      const rootLevel = {
        nodes: [node],
        next: null,
        gravity: 0,
        min: 0,
        max: 0
      } as Level
      constructLevels(rootLevel)

      return rootLevel
    }

    return constructTree(edges)
  }

  const rank = hierarchy(graphClone, edges)

  // ordering

  // position
  const xCoordinate = (root: Node) => {
    console.log(`I should iterate ${MAX_ITERATIONS} times for each ${root}.`)
    console.log(`This should take into account size: ${nodeB}, separation: ${nodeSep}, rank separation: ${rankSep}`)
    const initialiseCoords = (parent: Node) => {
      parent.x = 0
      parent.children.forEach(child => {
        initialiseCoords(child)
      })
    }
    initialiseCoords(root)
    const median = [0, 0]
    for (let i = 0; i < MAX_ITERATIONS; ++i) {

    }
  }

  xCoordinate(rank)

  return graphClone
}

export default GraphvizLayoutAlgorithm
