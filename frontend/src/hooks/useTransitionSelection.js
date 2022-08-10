import { useSelectionStore } from '/src/stores'

import useResourceSelection from './useResourceSelection'

const useStateSelection = () => {
  return useResourceSelection(
    () => useSelectionStore(s => s.selectedTransitions),
    () => useSelectionStore(s => s.setTransitions),
    'transition'
  )
}

export default useStateSelection
