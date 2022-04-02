import { StyledCircle } from './stateCircleStyle'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'

const FINAL_OUTLINE_OFFSET = 5

const StateCircle = ({ id, name, isFinal, cx, cy, selected, ...props }) => {

  // TODO: use prefix preference
  const displayName = name || `q${id}`

  return <g transform={`translate(${cx}, ${cy})`} {...props}>
    {/* Yellow Circle */}
    <StyledCircle r={STATE_CIRCLE_RADIUS} $selected={selected} />

    {/* Extra outline for final states */}
    { isFinal && <StyledCircle r={STATE_CIRCLE_RADIUS - FINAL_OUTLINE_OFFSET} $selected={selected} />}

    {/* Label */}
    <text textAnchor="middle" alignmentBaseline="central">
      {displayName}
    </text>
  </g>
}

export default StateCircle
