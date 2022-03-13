import { useState, useRef } from 'react'

import { DotGrid, GraphContent } from '/src/components'
import { MarkerProvider } from '/src/providers'

import { Svg } from './graphViewStyle'


const GraphView = props => {
  const containerRef = useRef()

  return (
    <Svg onContextMenu={e => e.preventDefault()} {...props} ref={containerRef}>
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
