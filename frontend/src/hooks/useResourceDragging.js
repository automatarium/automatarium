import { useState, useCallback } from 'react'

import { useEvent } from '/src/hooks'
import { useProjectStore, useToolStore, useViewStore, usePreferencesStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'

const useResourceDragging = (resourcesFromIDs, makeUpdateResource) => {
  const tool = useToolStore(s => s.tool)
  const toolActive = tool === 'cursor'

  const updateResource = makeUpdateResource()
  const commit = useProjectStore(s => s.commit)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)

  const [dragOffsets, setDragOffsets] = useState()
  const [dragCenters, setDragCenters] = useState()
  const [dragging, setDragging] = useState(null)

  const gridVisible = usePreferencesStore(state => state.preferences.showGrid)

  const startDrag = useCallback((e, selectedResourceIDs) => {
    if (toolActive) {
      const [x, y] = screenToViewSpace(e.detail.originalEvent.clientX, e.detail.originalEvent.clientY)
      const selected = resourcesFromIDs(selectedResourceIDs)

      setDragOffsets(selected.map(r => [x - r.x, y - r.y]))
      setDragCenters(selected.map(r => [r.x, r.y]))
      setDragging(selected.map(r => r.id))
    }
  }, [toolActive])

  // Listen for mouse move - dragging states
  useEvent('svg:mousemove', e => {
    if (dragging!== null && toolActive) {
      dragging.forEach((id, i) => {
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
        const [sx, sy] = (e.detail.originalEvent.altKey || !gridVisible)
          ? [dx, dy]
          : i === 0
            ? [Math.floor(dx / GRID_SNAP) * GRID_SNAP, Math.floor(dy / GRID_SNAP) * GRID_SNAP]
            : [(Math.floor(lx / GRID_SNAP) * GRID_SNAP) + lox, Math.floor(ly / GRID_SNAP) * GRID_SNAP + loy] 

        // Update state position
        updateResource({ id, x: sx, y: sy })
      })
    }
  }, [toolActive, dragging, gridVisible])

  // Listen for mouse up - stop dragging states
  useEvent('svg:mouseup', e => {
    if (e.detail.originalEvent.button === 0 && dragging !== null && toolActive) {
      // Commit drag to history
      commit()

      // Reset dragging state
      setDragOffsets(null)
      setDragCenters(null)
      setDragging(null)
      e.preventDefault()
    }
  }, [dragOffsets, dragCenters, toolActive, dragging])

  return { startDrag }
}

export default useResourceDragging
