import { useCallback } from 'react'
import { useToolStore, useSelectionStore } from '/src/stores'

const useStateSelection = () => {
  const tool = useToolStore(s => s.tool)

  const selectedStates = useSelectionStore(s => s.selectedStates)
  const setSelectedStates = useSelectionStore(s => s.setStates)
  const setSelectedTransitions = useSelectionStore(s => s.setTransitions)

  const selectState = useCallback(e => {
    let newSelected
    if (tool === 'cursor' || e.detail.originalEvent.button === 2) {
      // Select states
      const stateID = e.detail.state.id
      newSelected = selectedStates.includes(stateID)
        ? selectedStates
        : e.detail.originalEvent.shiftKey
          ? [...selectedStates, stateID]
          : [stateID]
      setSelectedStates(newSelected)

      // Reset selected transitions?
      if (!selectedStates.includes(stateID) && !e.detail.originalEvent.shiftKey) {
        setSelectedTransitions([])
      }
    }

    return newSelected
  }, [tool, selectedStates])

  return { selectState }
}

export default useStateSelection
