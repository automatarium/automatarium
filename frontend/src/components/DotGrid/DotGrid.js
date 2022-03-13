import { Fragment, useState, useEffect } from 'react'
import { GRID_SNAP } from '/src/config/interactions'
import { DOT_GRID_RADIUS } from '/src/config/rendering'

const DotGrid = ({ containerRef }) => {
  const [gridSize, setGridSize] = useState([30, 30])
  const spacing = GRID_SNAP * 2

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

  const [h, v] = gridSize
  return <g>
    {Array.from({ length: h }).map((_, i) => <Fragment key={i}>
      {Array.from({ length: v }).map((_, j) => <Fragment key={j}>
        <circle key={`${i},${j}`} cx={i*spacing} cy={j*spacing} r={DOT_GRID_RADIUS} fill='#eee' stroke='none'/>
      </Fragment>)}
    </Fragment>)}
  </g>
}

export default DotGrid
