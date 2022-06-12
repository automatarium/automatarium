import { circleStyles, circleSelectedStyles, textStyles } from './stateCircleStyle'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'
import { dispatchCustomEvent } from '/src/util/events'

const FINAL_OUTLINE_OFFSET = 5

const StateCircle = ({ id, name, isFinal, cx, cy, selected, ...props }) => {

  // TODO: use prefix preference
  const displayName = name || `q${id}`

  // TODO: use Callback
  const handleStateMouseUp = e =>
    dispatchCustomEvent('state:mouseup', {
      originalEvent: e,
      state: { id, name, cx, cy },
    })
  const handleStateMouseDown = e =>
    dispatchCustomEvent('state:mousedown', {
      originalEvent: e,
      state: { id, name, cx, cy },
    })

  return <g transform={`translate(${cx}, ${cy})`} onMouseDown={handleStateMouseDown} onMouseUp={handleStateMouseUp} {...props}>
    {/* Filled Circle */}
    <circle r={STATE_CIRCLE_RADIUS} style={selected ? circleSelectedStyles : circleStyles} />

    {/* Extra outline for final states */}
    { isFinal && <circle r={STATE_CIRCLE_RADIUS - FINAL_OUTLINE_OFFSET} style={selected ? circleSelectedStyles : circleStyles} />}

    {/* Label */}
    <text textAnchor="middle" alignmentBaseline="central" style={textStyles}>
      {displayName}
    </text>
  </g>
}

export default StateCircle
