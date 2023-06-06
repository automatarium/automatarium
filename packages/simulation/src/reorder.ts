import { Queue } from './collection'
import { ProjectGraph } from 'frontend/src/types/ProjectTypes'

/**
 * Reorders the states in the graph so they follow the flow i.e. we perform a basic topological sort.
 *
 * This takes into account the existing ID's and uses them to make decisions on which branches to take first. This
 * allows the user to have some choice in which branch should have a lower ID.
 *
 * This is performed by using a combination of breath and depth searches. If there is only a single path to take then it
 * goes depth first. If there are multiple branches then it adds them to the queue so it goes back to breath first.
 * i.e. This is a fancy floodfill
 * @param graph Graph to reorder
 */
export const reorderStates = <T extends ProjectGraph>(graph: T): T => {
  if (graph.initialState === null) return graph
  // Convert the graph into an adjacency list of transitions
  const graphList = new Map<number, number[]>()
  for (const t of graph.transitions) {
    if (!graphList.has(t.from)) graphList.set(t.from, [])
    graphList.get(t.from).push(t.to)
  }
  // Sort the lists so that states with lower ID go first.
  // We iterate transitions instead of states since not every state will
  // be in graphList (We only care about states with transitions)
  for (const t of graph.transitions) {
    graphList.get(t.from).sort((a, b) => a - b)
  }

  // Keep track of next available ID
  let nextID = 0
  // Keep track of mapping from old ID to new ID
  const mappings = new Map<number, number>()

  /**
   * @returns If the ID has been processed
   */
  const seen = (id: number): boolean => mappings.has(id)

  const frontier = new Queue<number>()
  frontier.add(graph.initialState)

  while (!frontier.isEmpty()) {
    let currID = frontier.remove()
    if (seen(currID)) continue
    mappings.set(currID, nextID++)
    // Continue down straight paths, so they have a continuous counting of ID's
    while (graphList.has(currID)) {
      const notSeen = graphList.get(currID).filter(x => !seen(x))
      // Either path is not straight or we have seen everything
      if (notSeen.length !== 1) break
      currID = notSeen[0]
      mappings.set(currID, nextID++)
    }
    // For multiple path options, we just add them to the queue and process later
    // We only add them if we haven't seen them
    graphList.get(currID)?.forEach(x => !seen(x) && frontier.add(x))
  }

  /**
   * Returns mapping for an ID. If a mapping doesn't exist then it picks next available ID
   */
  const getMapping = (oldID: number): number => {
    let result = mappings.get(oldID)
    if (result === undefined) {
      result = nextID++
      mappings.set(oldID, result)
    }
    return result
  }

  // Clone the graph
  const output = structuredClone(graph)
  // Update the initial graph using the mappings
  output.states.forEach(state => (state.id = getMapping(state.id)))
  for (const t of output.transitions) {
    t.from = getMapping(t.from)
    t.to = getMapping(t.to)
  }
  output.initialState = 0
  return output
}
