import { useProjectStore } from '/src/stores'

import useResourceDragging from './useResourceDragging'

const commentsFromIDs = IDs => {
  const comments = useProjectStore.getState()?.project?.comments ?? []
  return IDs
    .map(id => comments.find(comment => comment.id === id))
}

const makeUpdateComment = () => useProjectStore(s => s.updateComment)

export default useResourceDragging.bind(null, commentsFromIDs, makeUpdateComment)
