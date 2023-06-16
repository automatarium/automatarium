import { useProjectStore } from '/src/stores'

import useResourceDragging from './useResourceDragging'
import { ProjectComment } from '/src/types/ProjectTypes'

/**
 * Comment that doesn't have an optional ID (it is guaranteed to be set).
 * Since the filter only allows set IDs we can safely know this
 */
type CommentWithID = Omit<ProjectComment, 'id'> & {id: number}

const commentsFromIDs = (IDs: number[]): CommentWithID[] => {
  const comments = useProjectStore.getState()?.project?.comments ?? []
  return comments.filter(comment => IDs.includes(comment.id)) as CommentWithID[]
}

const makeUpdateComments = () => useProjectStore(s => s.updateComments)

export default () => useResourceDragging(commentsFromIDs, makeUpdateComments)
