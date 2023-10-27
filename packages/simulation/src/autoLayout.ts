import { ProjectGraph } from 'frontend/src/types/ProjectTypes'
import GemLayoutAlgorithm from './layouts/GemLayoutAlgorithm'
import GraphvizLayoutAlgorithm from './layouts/GraphvizLayoutAlgorithm'

type LayoutName = 'gem' | 'tree'
type LayoutAlgorithm = (graph: ProjectGraph) => ProjectGraph

const autoLayout = (graph: ProjectGraph, algorithm: LayoutName = 'gem') => {
  const algorithms = new Map<string, LayoutAlgorithm>([
    ['gem', GemLayoutAlgorithm],
    ['tree', GraphvizLayoutAlgorithm]
  ])
  if (!algorithms.has(algorithm)) { return null }
  return algorithms.get(algorithm)(graph)
}

export default autoLayout
