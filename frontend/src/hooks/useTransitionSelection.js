import { useCallback } from 'react'
import { useToolStore, useSelectionStore } from '/src/stores'

const useTransitionSelection = () => {
  const tool = useToolStore(s => s.tool)

  const selectedTransitions = useSelectionStore(s => s.selectedTransitions)
  const setSelectedTransitions = useSelectionStore(s => s.setTransitions)
  const setSelectedStates = useSelectionStore(s => s.setStates)

  const selectTransition = useCallback(e => {
    let newSelected
    if (tool === 'cursor') {
      // Update transition selections
      const transitionID = e.detail.transition.id
      newSelected = selectedTransitions.includes(transitionID)
        ? selectedTransitions
        : e.detail.originalEvent.shiftKey
          ? [...selectedTransitions, transitionID]
          : [transitionID]
      setSelectedTransitions(newSelected)

      // Reset selected states?
      if (!selectedTransitions.includes(transitionID) && !e.detail.originalEvent.shiftKey) {
        setSelectedStates([])
      }
    }
    return newSelected
  }, [tool, selectedTransitions])

  return { selectTransition }
}

export default useTransitionSelection
