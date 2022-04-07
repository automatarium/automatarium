import { useState, useEffect } from 'react'

import { useProjectStore, useViewStore, useToolStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'

const useStateDragging = ({ containerRef }) => {
  const tool = useToolStore(s => s.tool)
  const toolActive = tool === 'cursor'

  const viewScale = useViewStore(s => s.scale)
  const updateState = useProjectStore(s => s.updateState)
  const commit = useProjectStore(s => s.commit)

  const [dragOffsets, setDragOffsets] = useState()
  const [dragCenters, setDragCenters] = useState()
  const [draggingStates, setDraggingStates] = useState(null)

  const relativeMousePosition = (x, y) => {
    const b = containerRef.current.getBoundingClientRect()
    return [(x - b.left) * viewScale, (y - b.top) * viewScale]
  }

  const startDrag = (states, e) => {
    const [x, y] = relativeMousePosition(e.clientX, e.clientY)
    setDragOffsets(states.map(state => [x - state.x, y - state.y]))
    setDragCenters(states.map(state => [state.x, state.y]))
    setDraggingStates(states.map(state => state.id))
    e.preventDefault()
  }

  // Listen for mouse move - dragging states
  useEffect(() => {
    const doDrag = e => {
      if (draggingStates !== null && toolActive) {
        draggingStates.forEach((id, i) => {
          const [x, y] = relativeMousePosition(e.clientX, e.clientY)
          const [dx, dy] = [x - dragOffsets[i][0], y - dragOffsets[i][1]]

          // Snapped dragging
          const [sx, sy] = e.altKey
            ? [dx, dy]
            : [Math.floor(dx / GRID_SNAP) * GRID_SNAP, Math.floor(dy / GRID_SNAP) * GRID_SNAP]

          // Update state position
          updateState({ id, x: sx, y: sy })
        })
      }
    }
    containerRef.current.addEventListener('mousemove', doDrag)
    return () => containerRef.current.removeEventListener('mousemove', doDrag)
  })

  // Listen for mouse up - stop dragging states
  useEffect(() => {
    const cb = e => {
      if (e.button === 0 && draggingStates !== null && toolActive) {
        // Commit drag to history
        commit()

        // Reset dragging state
        setDragOffsets(null)
        setDragCenters(null)
        setDraggingStates(null)
        e.preventDefault()
      }
    }
    document.addEventListener('mouseup', cb)
    return () => document.removeEventListener('mouseup', cb)
  }, [dragOffsets, dragCenters, toolActive, draggingStates])

  return { startDrag }
}

export default useStateDragging
