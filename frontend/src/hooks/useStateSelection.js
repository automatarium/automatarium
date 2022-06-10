import { useSelectionStore } from '/src/stores'

import useResourceSelection from './useResourceSelection'

const useStateSelection = () => {
  return useResourceSelection(
    () => useSelectionStore(s => s.selectedStates),
    () => useSelectionStore(s => s.setStates),
    'state'
  )
}

export default useStateSelection
