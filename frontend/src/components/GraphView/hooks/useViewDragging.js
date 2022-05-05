import { useEffect, useCallback, useState } from 'react'

import { useViewStore, useToolStore } from '/src/stores'

import { SCROLL_MAX, SCROLL_MIN, SCROLL_SPEED } from '/src/config/interactions'

const useViewDragging = (containerRef) => {
  const currentTool = useToolStore(s => s.tool)
  const toolActive = currentTool === 'hand'

  const viewPosition = useViewStore(s => s.position)
  const viewScale = useViewStore(s => s.scale)
  const setViewPosition = useViewStore(s => s.setViewPosition)
  const setViewScale = useViewStore(s => s.setViewScale)

  // Keep track of drag events
  const [dragStartPosition, setDragStartPosition] = useState(null)
  const [dragStartViewPosition, setDragStartViewPosition] = useState(null)

  const relativeMousePosition = useCallback((x, y) => {
    const b = containerRef.current.getBoundingClientRect()
    return [
      x - b.left,
      y - b.top
    ]
  }, [containerRef?.current])

  const onWheel = e => {
    if (!containerRef.current.contains(e.target)) {
      return
    }

    // Prevent defaults
    e.stopPropagation()
    e.preventDefault()

    // Determine scroll amount and whether its possible
    const desiredScrollAmount = e.deltaY * SCROLL_SPEED / 5
    const newScale = Math.min(SCROLL_MAX, Math.max(SCROLL_MIN, viewScale + desiredScrollAmount))
    const scrollAmount = newScale - viewScale
    if (scrollAmount === 0)
      return

    const [mx, my] = relativeMousePosition(e.clientX, e.clientY)
    setViewPosition({
      x: viewPosition.x - mx * scrollAmount,
      y: viewPosition.y - my * scrollAmount,
    })
    setViewScale(newScale)
  }

  const onMouseDown = useCallback(e => {
    if (toolActive) {
      setDragStartPosition(relativeMousePosition(e.clientX, e.clientY))
      setDragStartViewPosition(viewPosition)
    }
  }, [toolActive, viewPosition])

  const onMouseUp = useCallback(() => {
    setDragStartPosition(null)
    setDragStartViewPosition(null)
  }, [])

  const onMouseMove = useCallback(e => {
    if (toolActive) {
      if (dragStartPosition !== null && dragStartViewPosition !== null) {
        const [sx, sy] = dragStartPosition
        const [mx, my] = relativeMousePosition(e.clientX, e.clientY)
        setViewPosition({
          x: dragStartViewPosition.x + (sx - mx) * viewScale,
          y: dragStartViewPosition.y + (sy - my) * viewScale,
        })
      }
    } else {
      onMouseUp()
    }
  }, [dragStartPosition, dragStartViewPosition])

  // Add listeners
  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('wheel', onWheel)
    }
  }, [onMouseUp, onMouseDown, onMouseMove, onWheel])
}

export default useViewDragging
