import { useEffect, useCallback, useState } from 'react'

import { useViewStore } from '/src/stores'

const useViewDragging = (containerRef, toolActive = false) => {
  const viewPosition = useViewStore(s => s.position)
  const setViewPosition = useViewStore(s => s.setViewPosition)

  const [dragStartPosition, setDragStartPosition] = useState(null)
  const [dragStartViewPosition, setDragStartViewPosition] = useState(null)

  const relativeMousePosition = useCallback((x, y) => {
    const b = containerRef.current.getBoundingClientRect()
    return [
      x - b.left,
      y - b.top
    ]
  }, [containerRef?.current])

  const onMouseDown = useCallback(e => {
    if (toolActive || e.ctrlKey) {
      setDragStartPosition(relativeMousePosition(e.clientX, e.clientY))
      setDragStartViewPosition(viewPosition)
    }
  }, [toolActive, viewPosition])

  const onMouseUp = useCallback(() => {
    setDragStartPosition(null)
    setDragStartViewPosition(null)
  }, [])

  const onMouseMove = useCallback(e => {
    if (toolActive || e.ctrlKey ) {
      if (dragStartPosition !== null && dragStartViewPosition !== null) {
        const [sx, sy] = dragStartPosition
        const [mx, my] = relativeMousePosition(e.clientX, e.clientY)
        setViewPosition({
          x: dragStartViewPosition.x + (sx - mx),
          y: dragStartViewPosition.y + (sy - my)
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
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  })
}

export default useViewDragging
