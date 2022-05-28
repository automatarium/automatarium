import { StyledCircle } from './stateCircleStyle'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'
import { dispatchEvent } from '/src/util/events'

const FINAL_OUTLINE_OFFSET = 5

const StateCircle = ({ id, name, isFinal, cx, cy, selected, ...props }) => {

  // TODO: use prefix preference
  const displayName = name || `q${id}`

  // TODO: use Callback
  const handleStateMouseUp = e =>
    dispatchEvent('state:mouseup', {
      originalEvent: e,
      state: { id, name, cx, cy },
    })
  const handleStateMouseDown = e =>
    dispatchEvent('state:mousedown', {
      originalEvent: e,
      state: { id, name, cx, cy },
    })

  return <g transform={`translate(${cx}, ${cy})`} onMouseDown={handleStateMouseDown} onMouseUp={handleStateMouseUp} {...props}>
    {/* Filled Circle */}
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
