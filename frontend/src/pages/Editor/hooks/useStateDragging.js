import { useState, useCallback } from 'react'

import { useEvent } from '/src/hooks'
import { useProjectStore, useToolStore, useSelectionStore, useViewStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'

const useStateDragging = () => {
  const tool = useToolStore(s => s.tool)
  const toolActive = tool === 'cursor'

  const updateState = useProjectStore(s => s.updateState)
  const commit = useProjectStore(s => s.commit)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)

  const [dragOffsets, setDragOffsets] = useState()
  const [dragCenters, setDragCenters] = useState()
  const [draggingStates, setDraggingStates] = useState(null)

  const startDrag = useCallback((e, selectedStateIDs) => {
    if (toolActive) {
      const [x, y] = screenToViewSpace(e.detail.originalEvent.clientX, e.detail.originalEvent.clientY)
      const states = useProjectStore.getState()?.project?.states ?? []
      const selectedStates = selectedStateIDs
        .map(id => states.find(state => state.id === id))

      setDragOffsets(selectedStates.map(state => [x - state.x, y - state.y]))
      setDragCenters(selectedStates.map(state => [state.x, state.y]))
      setDraggingStates(selectedStates.map(state => state.id))
    }
  }, [toolActive])

  // Listen for mouse move - dragging states
  useEvent('svg:mousemove', e => {
    if (draggingStates !== null && toolActive) {
      draggingStates.forEach((id, i) => {
        const [x, y] = [e.detail.viewX, e.detail.viewY]
        const [dx, dy] = [x - dragOffsets[i][0], y - dragOffsets[i][1]]

        // Determine leader position and offset from this state's position
        // This is used to determine snapping when dragging multiple states
        // (Leader is arbitrarily chosen as first in list of selected states)
        const [lx, ly] = i === 0
          ? [dx, dy]
          : [x - dragOffsets[0][0], y - dragOffsets[0][1]]
        const [lox, loy] = i === 0
          ? [0, 0]
          : [dragOffsets[0][0] - dragOffsets[i][0], dragOffsets[0][1] - dragOffsets[i][1]]

        // Snapped dragging
        // (Leader snaps to closest grid position, others follow leaders movement)
        const [sx, sy] = e.detail.originalEvent.altKey
          ? [dx, dy]
          : i === 0
            ? [Math.floor(dx / GRID_SNAP) * GRID_SNAP, Math.floor(dy / GRID_SNAP) * GRID_SNAP]
            : [(Math.floor(lx / GRID_SNAP) * GRID_SNAP) + lox, Math.floor(ly / GRID_SNAP) * GRID_SNAP + loy] 

        // Update state position
        updateState({ id, x: sx, y: sy })
      })
    }
  }, [toolActive, draggingStates])
  
  // Listen for mouse up - stop dragging states
  useEvent('svg:mouseup', e => {
    if (e.detail.originalEvent.button === 0 && draggingStates !== null && toolActive) {
      // Commit drag to history
      commit()

      // Reset dragging state
      setDragOffsets(null)
      setDragCenters(null)
      setDraggingStates(null)
      e.preventDefault()
    }
  }, [dragOffsets, dragCenters, toolActive, draggingStates])

  return { startDrag }
}

export default useStateDragging
