import { useProjectStore } from '../stores'
import { ProjectGraph } from '/src/types/ProjectTypes'

const useAutoLayout = (algorithm: (graph: ProjectGraph) => ProjectGraph) => {
  const getGraph = useProjectStore(s => s.getGraph)
  const setGraph = useProjectStore(s => s.updateGraph)

  const updatedGraph = algorithm(getGraph())
  setGraph(updatedGraph)
}

export default useAutoLayout
