import { useEffect, useState, useCallback } from 'react'

import { useProjectStore, useViewStore, useSelectionStore, useToolStore } from '/src/stores'

const SelectionBox = ({ containerRef }) => {
  const tool = useToolStore(s => s.tool)
  const toolActive = tool === 'cursor'
  const states = useProjectStore(s => s.project?.states)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const setSelectedStates = useSelectionStore(s => s.set)
  const [dragStart, setDragStart] = useState(null)
  const [mousePos, setMousePos] = useState(null)

  const handleMouseMove = useCallback(e => {
      setMousePos(screenToViewSpace(e.clientX, e.clientY, containerRef.current))
  }, [containerRef])

  const handleMouseDown = useCallback(e => {
    if (e.target === containerRef.current && toolActive) {
      setDragStart(screenToViewSpace(e.clientX, e.clientY, containerRef.current))
    }
  }, [toolActive, containerRef?.current])

  const handleMouseUp = useCallback(() => {
    if (dragStart !== null && toolActive) {
      const startX = Math.min(dragStart[0], mousePos[0])
      const startY = Math.min(dragStart[1], mousePos[1])
      const endX = Math.max(dragStart[0], mousePos[0])
      const endY = Math.max(dragStart[1], mousePos[1])
      const selected = states.filter(state =>
        state.x >= startX &&
        state.x <= endX &&
        state.y >= startY &&
        state.y <= endY).map(s => s.id)
      setSelectedStates(selected)
      setDragStart(null)
    }
  }, [toolActive, dragStart, mousePos, states])

  // Setup event listeners
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.addEventListener('mousedown', handleMouseDown)
      containerRef.current.addEventListener('mouseup', handleMouseUp)
      containerRef.current.addEventListener('mousemove', handleMouseMove)
      return () => {
        containerRef.current.removeEventListener('mousedown', handleMouseDown)
        containerRef.current.removeEventListener('mouseup', handleMouseUp)
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [containerRef?.current, handleMouseUp, handleMouseDown])

  if (!dragStart || !mousePos || !toolActive)
    return null

  const startX = Math.min(dragStart[0], mousePos[0])
  const startY = Math.min(dragStart[1], mousePos[1])
  const endX = Math.max(dragStart[0], mousePos[0])
  const endY = Math.max(dragStart[1], mousePos[1])

  return <rect
    x={startX}
    y={startY}
    width={endX-startX}
    height={endY-startY}
    fill="none"
    stroke="var(--black)"
    strokwidth="1"/>
}

export default SelectionBox
