import { useCallback } from 'react'
import { useEvent } from '/src/hooks'
import { useToolStore } from '/src/stores'
import { dispatchCustomEvent } from '/src/util/events'

const useCommentCreation = () => {
  const tool = useToolStore(s => s.tool)

  // Only require a slice of the event in the type else we get the long list of type ors
  type CommentToolData = { detail: { originalEvent: { button: number; clientX: number; clientY: number } } }

  const handleCommentMouseUp = useCallback((e: CommentToolData) => {
    if (tool === 'comment' && e.detail.originalEvent.button === 0) {
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
