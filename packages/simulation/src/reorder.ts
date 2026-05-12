import { Queue } from './collection'
import {
  FSAProjectGraph,
  PDAProjectGraph,
  TMProjectGraph
} from 'frontend/src/types/ProjectTypes'

type AutomataProjectGraph = FSAProjectGraph | PDAProjectGraph | TMProjectGraph

export const reorderStates = <T extends AutomataProjectGraph>(graph: T): T => {
  if (graph.initialState === null || graph.initialState === undefined) {
    return graph
  }

  const graphList = new Map<number, number[]>()

  for (const t of graph.transitions) {
    if (!graphList.has(t.from)) graphList.set(t.from, [])
    graphList.get(t.from)!.push(t.to)
  }

  for (const t of graph.transitions) {
    graphList.get(t.from)?.sort((a, b) => a - b)
  }

  let nextID = 0
  const mappings = new Map<number, number>()

  const seen = (id: number): boolean => mappings.has(id)

  const frontier = new Queue<number>()
  frontier.add(graph.initialState) // now safe

  while (!frontier.isEmpty()) {
    const removed = frontier.remove()

    if (removed === undefined) continue // 🔥 fix
    let currID = removed

    if (seen(currID)) continue

    mappings.set(currID, nextID++)

    while (graphList.has(currID)) {
      const notSeen = (graphList.get(currID) ?? []).filter(x => !seen(x))

      if (notSeen.length !== 1) break

      currID = notSeen[0]
      mappings.set(currID, nextID++)
    }

    graphList.get(currID)?.forEach(x => {
      if (!seen(x)) frontier.add(x)
    })
  }

  const getMapping = (oldID: number): number => {
    let result = mappings.get(oldID)

    if (result === undefined) {
      result = nextID++
      mappings.set(oldID, result)
    }

    return result
  }

  const output = structuredClone(graph) as T

  output.states.forEach(state => {
    state.id = getMapping(state.id)
  })

  for (const t of output.transitions) {
    t.from = getMapping(t.from)
    t.to = getMapping(t.to)
  }

  output.initialState = 0

  return output
}