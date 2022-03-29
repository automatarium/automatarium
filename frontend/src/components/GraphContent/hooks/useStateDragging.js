import { useState, useEffect } from 'react'

import { useProjectStore, useViewStore, useToolStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'

const useStateDragging = ({ containerRef }) => {
  const tool = useToolStore(s => s.tool)
  const toolActive = tool === 'cursor'

  const viewScale = useViewStore(s => s.scale)
  const updateState = useProjectStore(s => s.updateState)
  const commit = useProjectStore(s => s.commit)

  const [draggedState, setDraggedState] = useState(null)
  const [dragOffset, setDragOffset] = useState()
  const [dragCenter, setDragCenter] = useState()

  const relativeMousePosition = (x, y) => {
    const b = containerRef.current.getBoundingClientRect()
    return [(x - b.left) * viewScale, (y - b.top) * viewScale]
  }

  const startDrag = (state, e) => {
    if (toolActive) {
      const [x, y] = relativeMousePosition(e.clientX, e.clientY)
      setDraggedState(state.id)
      setDragOffset([x - state.x, y - state.y])
      setDragCenter([state.x, state.y])
      e.preventDefault()
    }
  }

  // Listen for mouse move - dragging states
  useEffect(() => {
    const doDrag = e => {
      if (draggedState !== null && toolActive) {
        const [x, y] = relativeMousePosition(e.clientX, e.clientY)
        const [dx, dy] = [x - dragOffset[0], y - dragOffset[1]]

        // Snapped dragging
        const [sx, sy] = e.altKey
          ? [dx, dy]
          : [Math.floor(dx / GRID_SNAP) * GRID_SNAP, Math.floor(dy / GRID_SNAP) * GRID_SNAP]

        // Aligned Dragging
        const distX = Math.abs(x - dragCenter[0])
        const distY = Math.abs(y - dragCenter[1])
        const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2))
        const [ax, ay] = e.shiftKey
          ? dist > STATE_CIRCLE_RADIUS/2
            ? (distX > distY ? [sx, dragCenter[1]] : [dragCenter[0], sy])
            : dragCenter
          : [sx, sy]

        // Update state position
        updateState({ id: draggedState, x: ax, y: ay })
      }
    }
    containerRef.current.addEventListener('mousemove', doDrag)
    return () => containerRef.current.removeEventListener('mousemove', doDrag)
  })

  // Listen for mouse up - stop dragging states
  useEffect(() => {
    const cb = e => {
      if (e.button === 0 && draggedState !== null && toolActive) {
        // Commit drag to history
        commit()

        // Reset dragging state
        setDraggedState(null)
        setDragOffset(null)
        setDragCenter(null)
        e.preventDefault()
      }
    }
    document.addEventListener('mouseup', cb)
    return () => document.removeEventListener('mouseup', cb)
  }, [draggedState, toolActive])

  return { startDrag }
}

export default useStateDragging
