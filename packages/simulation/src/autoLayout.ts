import { AutomataProjectGraph } from 'frontend/src/types/ProjectTypes'
import GemLayoutAlgorithm from './layouts/GemLayoutAlgorithm'
import GraphvizLayoutAlgorithm from './layouts/GraphvizLayoutAlgorithm'

type LayoutName = 'gem' | 'tree'
type LayoutAlgorithm = (graph: AutomataProjectGraph) => AutomataProjectGraph

const autoLayout = (graph: AutomataProjectGraph, algorithm: LayoutName = 'gem'): AutomataProjectGraph | null => {
  const algorithms = new Map<LayoutName, LayoutAlgorithm>([
    ['gem', GemLayoutAlgorithm],
    ['tree', GraphvizLayoutAlgorithm]
  ])
  if (!algorithms.has(algorithm)) { return null }
  const algorithmFn = algorithms.get(algorithm)
  return algorithmFn ? algorithmFn(graph) : null
}

export default autoLayout
