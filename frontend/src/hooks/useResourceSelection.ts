import { MouseEvent, useCallback } from 'react'

import { useSelectionStore, useToolStore } from '/src/stores'

export type SelectionEvent = CustomEvent<{originalEvent: MouseEvent, ids?: number[]}>

const useResourceSelection = (getSelected: () => number[], makeSetter: () => (x: number[]) => void, eventKey: string) => {
  const tool = useToolStore(s => s.tool)

  const selected = getSelected()
  const setSelected = makeSetter()
  const selectNone = useSelectionStore(s => s.selectNone)

  const select = useCallback<(e: SelectionEvent) => number[]>(e => {
    let newSelected: number[]
    if (tool === 'cursor' || e.detail.originalEvent.button === 2 || tool === 'delete') {
      // Things like transitions need to be able to send multiple ID's so that they don't
      // need to send individual events for each transition (This is for stacked transitions).
      const ids: number[] = 'ids' in e.detail ? e.detail.ids : [e.detail[eventKey].id]
      const alreadySelected = ids.some(id => selected.includes(id))
      const usedShift = e.detail.originalEvent.shiftKey
      if (alreadySelected && usedShift) {
        // If shifting on an already selected item then we can remove it
        newSelected = selected.filter(id => !ids.includes(id))
      } else if (usedShift) {
        // If shifting on a new resource, add it to the selected list
        newSelected = [...selected, ...ids]
      } else if (alreadySelected) {
        // If already selected then keep selected items.
        // This keeps the items selecting while dragging
        newSelected = selected
      } else {
        // Else just use what is selected
        newSelected = ids
      }
      // Reset selected states?
      if (!alreadySelected && !e.detail.originalEvent.shiftKey) {
        selectNone()
      }

      setSelected(newSelected)
    }
    return newSelected
  }, [tool, selected])

  return { select }
}

export default useResourceSelection
