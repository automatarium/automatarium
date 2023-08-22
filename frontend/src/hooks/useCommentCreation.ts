import { useEvent } from '/src/hooks'
import { dispatchCustomEvent } from '/src/util/events'
import { useToolStore } from '/src/stores'
import { useCallback } from 'react'

const useCommentCreation = () => {
  const tool = useToolStore(s => s.tool)

  const handleCommentMouseUp = useCallback((e) => {
    if (tool === 'comment' && e.detail.didTargetSVG && e.detail.originalEvent.button === 0) {
      window.setTimeout(() => dispatchCustomEvent('editComment', { x: e.detail.originalEvent.clientX, y: e.detail.originalEvent.clientY }), 100)
    }
  }, [tool])

  useEvent('svg:mouseup', handleCommentMouseUp)
  useEvent('state:mouseup', handleCommentMouseUp)
  useEvent('transition:mouseup', handleCommentMouseUp)
  useEvent('comment:mouseup', handleCommentMouseUp)
  useEvent('edge:mouseup', handleCommentMouseUp)
}

export default useCommentCreation
