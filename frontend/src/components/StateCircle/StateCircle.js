import { useMemo } from 'react'

import { circleStyles, circleSelectedStyles, textStyles, labelStyles } from './stateCircleStyle'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'
import { dispatchCustomEvent } from '/src/util/events'

import { ADJECTIVES } from '/src/util/projectName'

const FINAL_OUTLINE_OFFSET = 5

const StateCircle = ({ id, name, isFinal, cx, cy, selected, ...props }) => {

  // #HACK #TEMP
  const label = useMemo(() => ADJECTIVES[Math.random()*ADJECTIVES.length|0], [])

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

    {/* Name */}
    <text textAnchor="middle" alignmentBaseline="central" style={textStyles}>
      {displayName}
    </text>

    {/* Login */}
    <g transform={`translate(0, ${STATE_CIRCLE_RADIUS*.8})`}>
      <rect x={-9 * label?.length / 2} y={0} width={9 * label?.length} height={STATE_CIRCLE_RADIUS/1.5} style={labelStyles} />
      <text textAnchor='middle' alignmentBaseline='central' dy={10}>{label}</text>
    </g>
  </g>
}

export default StateCircle
