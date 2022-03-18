import { useEffect, useCallback, useState } from 'react'

import { useViewStore } from '/src/stores'

const SCROLL_MAX = 3
const SCROLL_MIN = 0.2
const SCROLL_SPEED = 0.01

const useViewDragging = (containerRef, toolActive = false) => {
  const viewPosition = useViewStore(s => s.position)
  const viewScale = useViewStore(s => s.scale)
  const viewSize = useViewStore(s => s.size)
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
    document.addEventListener('wheel', onWheel, { passive: false })
    // document.addEventListener('keydown', e => {
    //   if (e.code === 'KeyF')
    //     onWheel({ ...e, deltaY: .05 })
    //   if (e.code === 'KeyG')
    //     onWheel({ ...e, deltaY: -.05 })
    // })
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('wheel', onWheel)
    }
  })
}

export default useViewDragging
