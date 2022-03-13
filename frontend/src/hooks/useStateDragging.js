import { useState, useEffect } from 'react'

import { GRID_SNAP } from '/src/config/interactions'

const useStateDragging = ({ graphState, setGraphState, containerRef }) => {
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
  const doDrag = e => {
    if (draggedState !== null) {
      const [x, y] = relativeMousePosition(e.clientX, e.clientY)
      const [dx, dy] = [x - dragStartPosition[0], y - dragStartPosition[1]]
      const [sx, sy] = e.altKey
        ? [dx, dy]
        : [Math.floor(dx / GRID_SNAP) * GRID_SNAP, Math.floor(dy / GRID_SNAP) * GRID_SNAP]
      setGraphState({
        ...graphState,
        states: graphState.states.map(s => s.id === draggedState ? { ...s, x: sx, y: sy} : s)
      })
    }
  }

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

  return { startDrag, doDrag }
}

export default useStateDragging
