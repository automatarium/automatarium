import { useEffect, useRef, useCallback } from 'react'

import { DotGrid, GraphContent } from '/src/components'
import { MarkerProvider } from '/src/providers'
import { useViewStore } from '/src/stores'
import { VIEW_MOVE_STEP } from '/src/config/interactions' 

import { Svg } from './graphViewStyle'

const GraphView = props => {
  const containerRef = useRef()
  const { position, size, scale, setViewSize, moveViewPosition } = useViewStore()

  // Update width and height on resize
  const onContainerResize = useCallback(() => {
    const b = containerRef.current.getBoundingClientRect()
    setViewSize({ width: b.width, height: b.height })
  }, [])

  const onKeyDown = useCallback(e => {
    if (e.code === 'ArrowRight')
      moveViewPosition({ x: VIEW_MOVE_STEP })
    if (e.code === 'ArrowLeft')
      moveViewPosition({ x: -VIEW_MOVE_STEP })
    if (e.code === 'ArrowDown')
      moveViewPosition({ y: VIEW_MOVE_STEP })
    if (e.code === 'ArrowUp')
      moveViewPosition({ y: -VIEW_MOVE_STEP })
  })

  // Keep track of resizes
  // TODO: use onResize of container
  useEffect(() => {
    if (containerRef.current) {
      onContainerResize()
      window.addEventListener('resize', onContainerResize) 
      return () => window.removeEventListener('resize', onContainerResize) 
    }    
  }, [])

  // Keyboard commands for view control
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const viewBox = `${position.x} ${position.y} ${scale*size.width} ${scale*size.height}`
  return (
    <Svg onContextMenu={e => e.preventDefault()} viewBox={viewBox} {...props} ref={containerRef}>
      <MarkerProvider>
        <g>
          {/* Dot Grid */}
          <DotGrid containerRef={containerRef} />

          {/* Graph states and transitions */}
          <GraphContent containerRef={containerRef} />
        </g>
      </MarkerProvider>
    </Svg>
  )
}

export default GraphView
