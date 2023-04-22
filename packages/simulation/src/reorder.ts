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
  const graphList: {[key: number]: number[]} = {}
  graph.transitions.forEach(x => {
    if (!(x.from in graphList)) graphList[x.from] = []
    graphList[x.from].push(x.to)
  })
  // Sort the lists so that lower items go first
  graph.transitions.forEach(x => (graphList[x.from] = graphList[x.from].sort()))

  // Keep track of next available ID
  let nextID = 0
  // Keep track of mapping from old ID to new ID
  const mappings: {[key: number]: number} = {}
  /**
   * @returns If the ID has been processed
   */
  const seen = (id: number): boolean => id in mappings

  const frontier = new Queue<number>()
  frontier.add(graph.initialState)

  while (!frontier.isEmpty()) {
    let currID = frontier.remove()
    if (seen(currID)) continue
    mappings[currID] = nextID++
    // Continue down straight paths, so they have a continuous counting of ID's
    while (currID in graphList && graphList[currID].filter(x => !seen(x)).length === 1) {
      currID = graphList[currID].filter(x => !seen(x))[0]
      // Skip already seen items
      if (seen(currID)) currID = undefined
      if (currID !== undefined) {
        mappings[currID] = nextID++
      }
    }
    // For multiple path options, we just add them to the queue and process later
    // We only add them if we haven't seen them
    (graphList[currID] ?? []).forEach(x => !seen(x) && frontier.add(x))
  }
  /**
   * Returns mapping for an ID. If a mapping doesn't exist then it picks next available ID
   */
  const getMapping = (oldID: number): number => {
    let result = mappings[oldID]
    if (result === undefined) {
      result = nextID++
      mappings[oldID] = result
    }
    return result
  }
  // Clone the graph
  const output = structuredClone(graph)
  // Update the initial graph using the mappings
  output.states.forEach(state => (state.id = getMapping(state.id)))
  output.transitions.forEach(t => {
    t.from = getMapping(t.from)
    t.to = getMapping(t.to)
  })
  output.initialState = 0
  return output
}
