import { useCallback, useState } from 'react'

import { useViewStore, useToolStore } from '/src/stores'
import { useEvent } from '/src/hooks'

import { SCROLL_MAX, SCROLL_MIN, SCROLL_SPEED } from '/src/config/interactions'

const useViewDragging = containerRef => {
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

  useEvent('wheel', e => {
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
  }, [viewScale, viewPosition], {
    options: { passive: false }
  })

  useEvent('mousedown', e => {
    if (toolActive && containerRef.current?.contains(e.target)) {
      setDragStartPosition(relativeMousePosition(e.clientX, e.clientY))
      setDragStartViewPosition(viewPosition)
    }
  }, [toolActive, viewPosition])

  const onMouseUp = () => {
    setDragStartPosition(null)
    setDragStartViewPosition(null)
  }
  useEvent('mouseup', onMouseUp, [onMouseUp])

  useEvent('mousemove', e => {
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
}

export default useViewDragging
