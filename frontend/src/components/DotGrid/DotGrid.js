import { Fragment, useState, useEffect, useMemo } from 'react'
import { GRID_SNAP } from '/src/config/interactions'
import { DOT_GRID_RADIUS } from '/src/config/rendering'

import { DotGridContainer, DotGridCircle } from './dotGridStyle'

const DotGrid = () => {
  const spacing = GRID_SNAP * 4
  const [isAltKeyPressed, setIsAltKeyPressed] = useState(false)

  const gridSize = [
    30, 30
  ]

  const gridOffset = [
    0, 0
  ]

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
