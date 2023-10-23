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
      adj.sort((a, b) => a.weight + b.weight)// Descending
      const sortedNodes = adj
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

  const rank = hierarchy(dag, edges)

  // ordering

  // position
  const arrange = (root: Level) => {
    type Vector2 = { x: number, y: number }

    const globalGravity = { x: 0, y: 0 } as Vector2
    const gravStrength = Math.sqrt(nodeB[0] ** 2 + nodeB[1] ** 2)
    const ALPHA = 0.3 // 'Learning rate'

    const initialiseCoords = (parent: Node) => {
      parent.x = 0
      parent.y = 0
      parent.children.forEach(child => {
        initialiseCoords(child)
      })
    }

    const getCoords = (level: Level) => {
      return level.nodes.map(n => ({ x: n.x, y: n.y } as Vector2))
    }

    const apply = (level: Level, newCoords: Vector2[]) => {
      level.nodes.forEach((n, i) => {
        n.x = (1 - ALPHA) * n.x + ALPHA * newCoords[i].x
        n.y = (1 - ALPHA) * n.y + ALPHA * newCoords[i].y
      })
    }

    /** Recursively update each level gravity and global gravity */
    const updateGravity = (level: Level) => {
      if (level === null) { return }
      level.nodes.forEach(n => {
        globalGravity.x = (globalGravity.x + n.x) / (n.weight + 1)
        globalGravity.y = (globalGravity.y + n.y) / (n.weight + 1)
      })
      updateGravity(level.next)
    }

    // Optimise towards rank separation
    const rankSeparationShift = (base: Level, coords: Vector2[]) => {
      base.nodes.forEach((n, i) => {
        if (n.parent === null) { return }
        coords[i].y += Math.abs(n.parent.y - coords[i].y) - rankSep
      })
    }

    // Optimise towards level separation
    const levelSeparationShift = (base: Level, coords: Vector2[]) => {
      const sums = base.nodes.reduce((acc, val) => {
        return [acc[0] + val.x * val.weight, acc[1] + val.weight]
      }, [0, 0])
      const currentSeparation = sums[0] / sums[1]
      const step = nodeSep - currentSeparation
      base.nodes.forEach((_, i) => {
        if (i >= base.nodes.length - 1) { return }
        coords[i + 1].x += coords[i].x + step
      })
    }

    // Move towards level and global centre
    const gravityShift = (base: Level, coords: Vector2[]) => {
      const gravity = { x: (base.gravity + globalGravity.x) / 2, y: globalGravity.y }
      coords.forEach(c => {
        const vec = { x: gravity.x - c.x, y: gravity.y - c.y }
        const mag = Math.sqrt(vec.x ** 2 + vec.y ** 2)
        const unitVector = { x: vec.x / mag, y: vec.y / mag }
        c.x += unitVector.x * gravStrength
        c.y += unitVector.y * gravStrength
      })
    }

    // Align to parent rank coord
    const parentAlignmentShift = (base: Level, coords: Vector2[]) => {
      base.nodes.forEach((n, i) => {
        if (n.parent === null) return
        const parentX = n.parent.x
        coords[i].x += parentX - coords[i].x
      })
    }

    initialiseCoords(root.nodes[0])
    for (let _ = 0; _ < MAX_ITERATIONS; ++_) {
      let level = root
      while (level !== null) {
        const coords = getCoords(level)
        rankSeparationShift(level, coords)
        levelSeparationShift(level, coords)
        gravityShift(level, coords)
        parentAlignmentShift(level, coords)
        apply(level, coords)
        level = level.next
      }
      updateGravity(root)
    }
  }

  arrange(rank)

  // Update state positions

  return graphClone
}

export default GraphvizLayoutAlgorithm
