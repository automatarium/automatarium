import { STATE_CIRCLE_RADIUS, STATE_TRIANGLE_WIDTH, STATE_TRIANGLE_HEIGHT } from '/src/config/rendering'
import { AutomataState } from '/src/types/ProjectTypes'

interface InitialStateArrowProps {
  states: AutomataState[]
  initialStateID: number
}

const InitialStateArrow = ({ states, initialStateID }: InitialStateArrowProps) => {
  const initialState = states.find(s => s.id === initialStateID)
  if (!initialState) { return null }

  const { x, y } = initialState
  const triangleStart = `${x - STATE_CIRCLE_RADIUS}, ${y}`
  const triangleTopLeft = `${x - STATE_TRIANGLE_WIDTH - STATE_CIRCLE_RADIUS}, ${y - STATE_TRIANGLE_HEIGHT}`
  const triangleBottomLeft = `${x - STATE_TRIANGLE_WIDTH - STATE_CIRCLE_RADIUS}, ${y + STATE_TRIANGLE_HEIGHT}`
  return <g>
    <polygon
      points={`${triangleStart} ${triangleTopLeft} ${triangleBottomLeft}`}
      style={{
        fill: 'var(--initial-arrow-bg, var(--grid-bg))',
        stroke: 'var(--stroke)'
      }}
    />
  </g>
}

export default InitialStateArrow
