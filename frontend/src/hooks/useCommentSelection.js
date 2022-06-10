import { useSelectionStore } from '/src/stores'

import useResourceSelection from './useResourceSelection'

const useCommentSelection = () => {
  return useResourceSelection(
    () => useSelectionStore(s => s.selectedComments),
    () => useSelectionStore(s => s.setComments),
    'comment'
  )
}

export default useCommentSelection
