import { useEvent } from '/src/hooks'
import { useProjectStore, useToolStore } from '/src/stores'

const useStateCreation = () => {
  const tool = useToolStore(s => s.tool)
  const createState = useProjectStore(s => s.createState)
  const commit = useProjectStore(s => s.commit)

  useEvent('svg:mousedown', e => {
    if (tool === 'state' && e.detail.didTargetSVG && e.detail.originalEvent.button === 0) {
      createState({ x: e.detail.viewX, y: e.detail.viewY })
      commit()
    }
  }, [tool])
}

export default useStateCreation
