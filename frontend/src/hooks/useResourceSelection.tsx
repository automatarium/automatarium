import { useCallback } from 'react'

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
      // Update transition selections
      const ids: number[] = 'ids' in e.detail ? e.detail.ids : [e.detail[eventKey].id]
      const alreadySelected = ids.some(id => selected.includes(id))
      newSelected = alreadySelected
        ? selected
        : e.detail.originalEvent.shiftKey
          ? [...selected, ...ids]
          : [...ids]
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
