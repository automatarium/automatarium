import { useEffect, useRef, useCallback } from 'react'

import { GraphContent, SelectionBox } from '/src/components'
import { MarkerProvider } from '/src/providers'
import { useViewStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'

import { Svg } from './graphViewStyle'
import { ContextMenus, InputDialogs } from './components'
import { useViewDragging } from './hooks'

const GraphView = props => {
  const containerRef = useRef()
  const { position, size, scale, setViewSize, moveViewPosition } = useViewStore()
  useViewDragging(containerRef)

  // Update width and height on resize
  const onContainerResize = useCallback(() => {
    const b = containerRef.current.getBoundingClientRect()
    setViewSize({ width: b.width, height: b.height })
  }, [])

  // Keep track of resizes
  // TODO: use onResize of container
  useEffect(() => {
    if (containerRef.current) {
      onContainerResize()
      window.addEventListener('resize', onContainerResize)
      return () => window.removeEventListener('resize', onContainerResize)
    }
  }, [])

  // Determine svg background (grid)
  const backgroundPosition = `${-position.x / scale}px ${-position.y / scale}px`
  const backgroundSize = `${1 / scale * GRID_SNAP * 2}px ${1 / scale * GRID_SNAP * 2}px`
  const showGrid = true

  const viewBox = `${position.x} ${position.y} ${scale*size.width} ${scale*size.height}`
  return (
    <>
      <Svg
        onContextMenu={e => e.preventDefault()}
        onMouseUp={e => {
          if (e.button === 2) {
            const rightClickEvent = new CustomEvent('graphContext', { detail: {
              x: e.clientX,
              y: e.clientY,
            }})
            document.dispatchEvent(rightClickEvent)
          }
        }}
        viewBox={viewBox}
        ref={containerRef}
        $showGrid={showGrid}
        {...props}
        style={{ backgroundSize, backgroundPosition, ...props.style }}>
        <MarkerProvider>
          <g>
            {/* Graph states and transitions */}
            <GraphContent containerRef={containerRef} />

            {/* Selection Drag Box */}
            <SelectionBox containerRef={containerRef} />
          </g>
        </MarkerProvider>
      </Svg>

      <ContextMenus />
      <InputDialogs />
    </>
  )
}

export default GraphView
