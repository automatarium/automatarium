import { useEvent } from '/src/hooks'
import { useProjectStore, useToolStore } from '/src/stores'

const useCommentCreation = () => {
  const tool = useToolStore(s => s.tool)
  const createComment = useProjectStore(s => s.createComment)
  const commit = useProjectStore(s => s.commit)

  useEvent('svg:mousedown', e => {
    if (tool === 'comment' && e.detail.didTargetSVG && e.detail.originalEvent.button === 0) {
      const text = window.prompt('Text of comment?')
      if (!text || /^\s*$/.test(text)) return
      createComment({ x: e.detail.viewX, y: e.detail.viewY, text })
      commit()
    }
  }, [tool])
}

export default useCommentCreation
