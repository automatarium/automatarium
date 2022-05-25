import { useEffect, useRef, useCallback } from 'react'

import { MarkerProvider } from '/src/providers'
import { useViewStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'
import { dispatchEvent } from '/src/util/events'

import { Svg } from './graphViewStyle'
import { useViewDragging } from './hooks'

const GraphView = ({ children, ...props }) => {
  const containerRef = useRef()
  const { position, size, scale, setViewSize, setSvgElement, screenToViewSpace } = useViewStore()
  useViewDragging(containerRef)

  // Update width and height on resize
  const onContainerResize = useCallback(() => {
    const b = containerRef.current.getBoundingClientRect()
    setViewSize({ width: b.width, height: b.height })
  }, [])

  const onContainerMouseDown = useCallback(e => {
    const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
    dispatchEvent('svg:mousedown', {
      originalEvent: e,
      didTargetSVG: e.target === containerRef?.current,
      viewX, viewY
    })
  }, [])

  const onContainerMouseUp = useCallback(e => {
    const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
    dispatchEvent('svg:mouseup', {
      originalEvent: e,
      didTargetSVG: e.target === containerRef?.current,
      viewX, viewY
    })
  }, [])

  const onContainerMouseMove = useCallback(e => {
    const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
    dispatchEvent('svg:mousemove', {
      originalEvent: e,
      didTargetSVG: e.target === containerRef?.current,
      viewX, viewY
    })
  }, [])

  // Keep track of resizes
  // TODO: use onResize of container
  useEffect(() => {
    if (containerRef.current) {
      // Update reference
      setSvgElement(containerRef.current)
      
      // Manage resizing of view
      onContainerResize()
      window.addEventListener('resize', onContainerResize)
      
      // Setup handlers
      containerRef.current.addEventListener('mousedown', onContainerMouseDown)
      containerRef.current.addEventListener('mouseup', onContainerMouseUp)
      containerRef.current.addEventListener('mousemove', onContainerMouseMove)

      // Unset handlers
      return () => {
        window.removeEventListener('resize', onContainerResize)
        containerRef.current.removeEventListener('mousedown', onContainerMouseDown)
        containerRef.current.removeEventListener('mouseup', onContainerMouseUp)
        containerRef.current.removeEventListener('mousedown', onContainerMouseMove)
      }
    }
  }, [containerRef.current])

  // Determine svg background (grid)
  const backgroundPosition = `${-position.x / scale}px ${-position.y / scale}px`
  const backgroundSize = `${1 / scale * GRID_SNAP * 2}px ${1 / scale * GRID_SNAP * 2}px`
  const showGrid = true

  const viewBox = `${position.x} ${position.y} ${scale*size.width} ${scale*size.height}`
  return (
    <Svg
      onContextMenu={e => e.preventDefault()}
      viewBox={viewBox}
      ref={containerRef}
      $showGrid={showGrid}
      {...props}
      style={{ backgroundSize, backgroundPosition, ...props.style }}>
      <MarkerProvider>
        <g>
          {children}
        </g>
      </MarkerProvider>
    </Svg>
  )
}

export default GraphView
