import GemLayoutAlgorithm from '/src/util/Layouts/GemLayoutAlgorithm'
import { ProjectGraph } from '/src/types/ProjectTypes'

type LayoutName = 'gem'
type LayoutAlgorithm = (graph: ProjectGraph) => ProjectGraph

const useAutoLayout = (graph: ProjectGraph, algorithm: LayoutName = 'gem') => {
  const algorithms = new Map<string, LayoutAlgorithm>([
    ['gem', GemLayoutAlgorithm]
  ])
  if (!algorithms.has(algorithm)) { return null }
  return algorithms.get(algorithm)(graph)
}

export default useAutoLayout
