import { useState, useEffect } from 'react'

import { useProjectStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'

const useStateDragging = ({ containerRef }) => {
  const updateState = useProjectStore(s => s.updateState)
  const [draggedState, setDraggedState] = useState(null)
  const [dragStartPosition, setDragStartPosition] = useState()

  const relativeMousePosition = (x, y) => {
    const b = containerRef.current.getBoundingClientRect()
    return [
      x - b.left,
      y - b.top,
    ]
  }

  const startDrag = (state, e) => {
    const [x, y] = relativeMousePosition(e.clientX, e.clientY)
    setDraggedState(state.id)
    setDragStartPosition([x - state.x, y - state.y])
    e.preventDefault()
  }

  // Listen for mouse move - dragging states
  useEffect(() => {
    const doDrag = e => {
      if (draggedState !== null) {
        const [x, y] = relativeMousePosition(e.clientX, e.clientY)
        const [dx, dy] = [x - dragStartPosition[0], y - dragStartPosition[1]]
        const [sx, sy] = e.altKey
          ? [dx, dy]
          : [Math.floor(dx / GRID_SNAP) * GRID_SNAP, Math.floor(dy / GRID_SNAP) * GRID_SNAP]
        updateState({ id: draggedState, x: sx, y: sy })
      }
    }
    containerRef.current.addEventListener('mousemove', doDrag)
    return () => containerRef.current.removeEventListener('mousemove', doDrag)
  })

  // Listen for mouse up - stop dragging states
  useEffect(() => {
    const cb = e => {
      if (e.button === 0) {
        setDraggedState(null)
        setDragStartPosition(null)
        e.preventDefault()
      }
    }
    document.addEventListener('mouseup', cb)
    return () => document.removeEventListener('mouseup', cb)
  }, [])

  return { startDrag }
}

export default useStateDragging
