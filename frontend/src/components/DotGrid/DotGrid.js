import { Fragment, useState, useEffect } from 'react'
import { GRID_SNAP } from '/src/config/interactions'
import { DOT_GRID_RADIUS } from '/src/config/rendering'
import { useViewStore } from '/src/stores'

import { DotGridContainer, DotGridCircle } from './dotGridStyle'

const DotGrid = () => {
  const spacing = GRID_SNAP * 2
  const [isAltKeyPressed, setIsAltKeyPressed] = useState(false)
  const position = useViewStore(s => s.position)
  const scale = useViewStore(s => s.scale)
  const size = useViewStore(s => s.size)

  const gridSize = [
    Math.floor((scale * size.width) / spacing) + 3,
    Math.floor((scale * size.height) / spacing) + 3,
  ]

  const gridOffset = [
    (Math.floor((position.x * scale) / spacing) * spacing) - spacing,
    (Math.floor((position.y * scale) / spacing) * spacing) - spacing,
  ]

  useEffect(() => {
    const handleKeyDown = e => setIsAltKeyPressed(e.altKey)
    const handleKeyUp = e => setIsAltKeyPressed(false)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  })

  const [h, v] = gridSize
  return <DotGridContainer data-snapping={!isAltKeyPressed}>
    {Array.from({ length: h }).map((_, i) => <Fragment key={i}>
      {Array.from({ length: v }).map((_, j) => <Fragment key={j}>
        <DotGridCircle key={`${i},${j}`} cx={gridOffset[0] + i*spacing} cy={gridOffset[1] + j*spacing} r={DOT_GRID_RADIUS} />
      </Fragment>)}
    </Fragment>)}
  </DotGridContainer>
}

export default DotGrid
