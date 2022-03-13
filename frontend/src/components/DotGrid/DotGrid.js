import { Fragment, useState, useEffect } from 'react'
import { GRID_SNAP } from '/src/config/interactions'
import { DOT_GRID_RADIUS } from '/src/config/rendering'

import { DotGridContainer } from './dotGridStyle'

const DotGrid = ({ containerRef }) => {
  const [gridSize, setGridSize] = useState([30, 30])
  const spacing = GRID_SNAP * 2
  const [isAltKeyPressed, setIsAltKeyPressed] = useState(false)

  const calculateGridSize = () => {
    const box = containerRef?.current.getBoundingClientRect()
    setGridSize([
      Math.floor(box.width / spacing),
      Math.floor(box.height / spacing),
    ])
  }

  // Recompute grid size on resize
  useEffect(() => {
    window.setTimeout(calculateGridSize, 10)
    window.addEventListener('resize', calculateGridSize)
    return () => window.removeEventListener('resize', calculateGridSize)
  }, [])

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
        <circle key={`${i},${j}`} cx={i*spacing} cy={j*spacing} r={DOT_GRID_RADIUS} fill='#eee' stroke='none'/>
      </Fragment>)}
    </Fragment>)}
  </DotGridContainer>
}

export default DotGrid
