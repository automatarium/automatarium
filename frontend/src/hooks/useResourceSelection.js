import { useCallback } from 'react'

import { useSelectionStore, useToolStore } from '/src/stores'

const useResourceSelection = (makeSelected, makeSetSelected, eventKey) => {
  const tool = useToolStore(s => s.tool)

  const selected = makeSelected()
  const setSelected = makeSetSelected()
  const selectNone = useSelectionStore(s => s.selectNone)

  const select = useCallback(e => {
    let newSelected
    if (tool === 'cursor' || e.detail.originalEvent.button === 2) {
      // Update transition selections
      const id = e.detail[eventKey].id
      newSelected = selected.includes(id)
        ? selected
        : e.detail.originalEvent.shiftKey
          ? [...selected, id]
          : [id]

      // Reset selected states?
      if (!selected.includes(id) && !e.detail.originalEvent.shiftKey) {
        selectNone()
      }

      setSelected(newSelected)
    }
    return newSelected
  }, [tool, selected])

  return { select }
}

export default useResourceSelection
