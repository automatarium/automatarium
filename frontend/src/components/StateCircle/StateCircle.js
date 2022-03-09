import { StyledCircle } from './stateCircleStyle'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'

const FINAL_OUTLINE_OFFSET = 5

const StateCircle = ({ name, isFinal, cx, cy, onMouseDown, ...props }) => {
  return <g transform={`translate(${cx}, ${cy})`} onMouseDown={e => onMouseDown(name, e)}>
    {/* Yellow Circle */}
    <StyledCircle r={STATE_CIRCLE_RADIUS} />

    {/* Extra outline for final states */}
    { isFinal && <StyledCircle r={STATE_CIRCLE_RADIUS - FINAL_OUTLINE_OFFSET} />}

    {/* Label */}
    <text textAnchor="middle" alignmentBaseline="central">
      {name}
    </text>
  </g>
}

export default StateCircle
