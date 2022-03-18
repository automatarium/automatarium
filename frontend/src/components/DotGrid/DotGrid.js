import { Fragment, useState, useEffect, useMemo } from 'react'
import { GRID_SNAP } from '/src/config/interactions'
import { DOT_GRID_RADIUS } from '/src/config/rendering'
import { useViewStore } from '/src/stores'

import { DotGridContainer, DotGridCircle } from './dotGridStyle'

const DotGrid = () => {
  const spacing = GRID_SNAP * 4
  const [isAltKeyPressed, setIsAltKeyPressed] = useState(false)
  const position = useViewStore(s => s.position)
  const scale = useViewStore(s => s.scale)
  const size = useViewStore(s => s.size)

  const gridSize = useMemo(() => [
    Math.floor((scale * size.width) / spacing) + 3,
    Math.floor((scale * size.height) / spacing) + 3,
  ], [scale, size])

  const gridOffset = useMemo(() => [
    (Math.floor((position.x * scale) / spacing) * spacing) - spacing,
    (Math.floor((position.y * scale) / spacing) * spacing) - spacing,
  ], [position, scale])

  useEffect(() => {
    const handleKeyDown = e => setIsAltKeyPressed(e.altKey)
    const handleKeyUp = () => setIsAltKeyPressed(false)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Render and memoize the dots
  const dots = useMemo(() =>
    Array.from({ length: gridSize[0] }).map((_, i) => <Fragment key={i}>
      {Array.from({ length: gridSize[1] }).map((_, j) => <Fragment key={j}>
        <DotGridCircle key={`${i},${j}`} cx={gridOffset[0] + i*spacing} cy={gridOffset[1] + j*spacing} r={DOT_GRID_RADIUS} />
      </Fragment>)}
    </Fragment>)
  , [gridOffset[0], gridOffset[1], gridSize[0], gridSize[1]])

  return <DotGridContainer data-snapping={!isAltKeyPressed}>
    {dots}
  </DotGridContainer>
}

export default DotGrid
