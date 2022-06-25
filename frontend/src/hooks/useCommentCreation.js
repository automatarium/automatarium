import { useEvent } from '/src/hooks'
import { dispatchCustomEvent } from '/src/util/events'
import { useToolStore } from '/src/stores'

const useCommentCreation = () => {
  const tool = useToolStore(s => s.tool)

  useEvent('svg:mouseup', e => {
    if (tool === 'comment' && e.detail.didTargetSVG && e.detail.originalEvent.button === 0) {
      window.setTimeout(() => dispatchCustomEvent('editComment', { x: e.detail.originalEvent.clientX, y: e.detail.originalEvent.clientY }), 100)
    }
  }, [tool])
}

export default useCommentCreation
