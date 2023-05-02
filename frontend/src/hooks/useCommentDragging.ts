import { useProjectStore } from '/src/stores'

import useResourceDragging from './useResourceDragging'

const commentsFromIDs = (IDs: number[]) => {
  const comments = useProjectStore.getState()?.project?.comments ?? []
  return comments.filter(comment => IDs.includes(comment.id))
}

const makeUpdateComment = () => useProjectStore(s => s.updateComment)

export default useResourceDragging.bind(null, commentsFromIDs, makeUpdateComment)
