import GemLayoutAlgorithm from '/src/providers/Layouts/GemLayoutAlgorithm'
import { useProjectStore } from '/src/stores'
import { ProjectGraph } from '/src/types/ProjectTypes'

const useAutoLayout = (algorithm: (graph: ProjectGraph) => ProjectGraph = GemLayoutAlgorithm) => {
  const getGraph = useProjectStore(s => s.getGraph)
  const setGraph = useProjectStore(s => s.updateGraph)

  const updatedGraph = algorithm(getGraph())
  setGraph(updatedGraph)
}

export default useAutoLayout
