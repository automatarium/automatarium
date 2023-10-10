import GemLayoutAlgorithm from './layouts/GemLayoutAlgorithm'
import { ProjectGraph } from 'frontend/src/types/ProjectTypes'

type LayoutName = 'gem'
type LayoutAlgorithm = (graph: ProjectGraph) => ProjectGraph

const autoLayout = (graph: ProjectGraph, algorithm: LayoutName = 'gem') => {
  const algorithms = new Map<string, LayoutAlgorithm>([
    ['gem', GemLayoutAlgorithm]
  ])
  if (!algorithms.has(algorithm)) { return null }
  return algorithms.get(algorithm)(graph)
}

export default autoLayout
