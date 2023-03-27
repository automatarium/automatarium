import { UnparsedGraph } from './graph'
import { Queue } from './collection'

/**
 * Reorders the states in the graph so they follow the flow i.e. we perform a basic topological sort.
 *
 * This takes into account the existing ID's and uses them to make decisions on which branches to take first. This
 * allows the user to have some choice in which branch should have a lower ID.
 *
 * This is performed by using a combination of breath and depth searches. If there is only a single path to take then it
 * goes depth first. If there are multiple branches then it adds them to the queue so it goes back to breath first
 * @param graph Graph to reorder. This is performed in-place
 */
export const reorderStates = (graph: UnparsedGraph) => {
  // Convert the graph into an adjency list of transitions
  const graphList: {[key: number]: number[]} = {}
  graph.transitions.forEach(x => {
    if (!(x.from in graphList)) {
      graphList[x.from] = []
    }
    graphList[x.from].push(x.to)
  })
  // The next available ID
  let nextID = 0
  // Keep track of mapping from old ID to new ID
  const mappings: {[key: number]: number} = {}

  const frontier = new Queue<number>()
  frontier.add(graph.initialState)
  while (!frontier.isEmpty()) {
    let currID = frontier.remove()
    mappings[currID] = nextID++
    // Continue down straight paths so they have a continuous counting of ID's
    while ((graphList[currID] ?? []).length === 1) {
      currID = graphList[currID][0]
      if (currID !== undefined) {
        mappings[currID] = nextID++
      }
    }
    // Add the choices into the queue
    (graphList[currID] ?? []).forEach(x => frontier.add(x))
  }
  // Update the initial graph using the mappings
  graph.states.forEach(state => (state.id = mappings[state.id]))
  graph.transitions.forEach(t => {
    t.from = mappings[t.from]
    t.to = mappings[t.to]
  })
  graph.initialState = 0
}
