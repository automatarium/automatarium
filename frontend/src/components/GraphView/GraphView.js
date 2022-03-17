import { useEffect, useRef, useCallback } from 'react'

import { DotGrid, GraphContent } from '/src/components'
import { MarkerProvider } from '/src/providers'
import { useViewStore } from '/src/stores'

import { Svg } from './graphViewStyle'


const GraphView = props => {
  const containerRef = useRef()
  const { position, size, scale, setViewSize } = useViewStore()

  // Update width and height on resize
  const onContainerResize = useCallback(() => {
    const b = containerRef.current.getBoundingClientRect()
    setViewSize({ width: b.width, height: b.height })
  }, [])

  // Keep track of resizes
  useEffect(() => {
    if (containerRef.current) {
      onContainerResize()
      window.addEventListener('resize', onContainerResize) 
      return () => window.removeEventListener('resize', onContainerResize) 
    }    
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
