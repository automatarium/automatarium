import { useContext } from 'react'

import { MarkerContext } from '/src/providers'
import { STATE_CIRCLE_RADIUS, TRANSITION_SEPERATION, TEXT_PATH_OFFSET, REFLEXIVE_Y_OFFSET, REFLEXIVE_X_OFFSET } from '/src/config/rendering'
import { movePointTowards, lerpPoints, size } from '/src/util/points'
import { dispatchCustomEvent } from '/src/util/events'
import { useSelectionStore } from '/src/stores'

import { StyledPath } from './transitionSetStyle'

const TransitionSet = ({ transitions }) => <>
  { transitions.map(({id, from, to, read}, i) => (
    <Transition
      i={i}
      count={transitions.length}
      text={read}
      from={from}
      to={to}
      id={id}
      key={id}
    />)
  )}
</>

const Transition = ({ id, i, count, from, to, text, fullWidth=false, suppressEvents=false }) => {
  const { standardArrowHead, selectedArrowHead } = useContext(MarkerContext)
  const selectedTransitions = useSelectionStore(s => s.selectedTransitions)
  const selected = selectedTransitions?.includes(id)

  // Determine how much to bend this path
  const middleValue = count % 2 == 0 ? count / 2 : count / 2 + .5
  const bendValue = TRANSITION_SEPERATION * (count > 1 ? middleValue - (i+1) : 0) / 2

  // Calculate path
  const { pathData, textPathData } = calculateTransitionPath({ from, to, bendValue, fullWidth }) 

  // Generate a unique id for this path
  // -- used to place the text on the same path
  const pathID = `${i}${from.x}${from.y}${to.x}${to.y}`

  // TODO: use Callback
  const handleTransitionMouseUp = e =>
    dispatchCustomEvent('transition:mouseup', {
      originalEvent: e,
      transition: { id, from, to, text },
    })
  const handleTransitionMouseDown = e =>
    dispatchCustomEvent('transition:mousedown', {
      originalEvent: e,
      transition: { id, from, to, text },
    })

  return <>
    {/*The edge itself*/}
    <StyledPath id={pathID} d={pathData} key={pathID} markerEnd={`url(#${selected ? selectedArrowHead : standardArrowHead})`} $selected={selected} />

    {/* Invisible path used to place text */}
    <path id={`${pathID}-text`} d={textPathData} key={`${pathID}-text`} stroke='none' fill='none' />

    {/* Thicker invisible path used to select the transition */}
    {!suppressEvents && <path
      id={pathID}
      d={pathData}
      key={`${pathID}-selection`}
      stroke='transparent'
      fill='none'
      strokeWidth={20}
      onMouseDown={handleTransitionMouseDown}
      onMouseUp={handleTransitionMouseUp}
    />}

    {/* The label - i.e the accepted symbols*/}
    <text
      onMouseDown={!suppressEvents ? handleTransitionMouseDown : undefined}
      onMouseUp={!suppressEvents ? handleTransitionMouseUp : undefined}
      fill={selected ? 'var(--primary)' : 'black' }
    >
      <textPath startOffset="50%" textAnchor="middle" alignmentBaseline="bottom" xlinkHref={`#${pathID}-text`}>
        {text === '' ? 'λ' : text}
      </textPath>
    </text>
  </>
}

const calculateTransitionPath = ({ from, to, bendValue, fullWidth }) => {

  // Is this path reflexive
  const isReflexive = from.x === to.x && from.y === to.y

  // Determine control position
  // -- this is determined by moving along the normal to the difference between the states
  // -- with the distance moved controled by the `bend` value
  const center = lerpPoints(from, to, .5)
  const tangent = { x: to.x - from.x, y: to.y - from.y }
  const a = Math.PI/2
  const orth = { x: tangent.x * Math.cos(a) - tangent.y * Math.sin(a), y: tangent.x * Math.sin(a) + tangent.y * Math.cos(a) }
  const normal = size(orth) > 0 ? { x: orth.x / size(orth), y: orth.y / size(orth) } : { x: 0, y: 0 }
  const control = isReflexive
    ? { x: from.x, y: from.y - REFLEXIVE_Y_OFFSET }
    : { x: center.x + bendValue * normal.x, y: center.y + bendValue * normal.y }
  
  // Translate control points (Used for reflexive paths)
  const translatedControl1 = !isReflexive ? control : { ...control, x: control.x - REFLEXIVE_X_OFFSET }
  const translatedControl2= !isReflexive ? control : { ...control, x: control.x + REFLEXIVE_X_OFFSET }

  // We connect the edge to the closest point on each circle from the control point
  // (If fullWidth is set we move it just far enough to prevent accidental click events)
  const edge1 = fullWidth
    ? movePointTowards(from, translatedControl1, 2)
    : movePointTowards(from, translatedControl1, STATE_CIRCLE_RADIUS)
  const edge2 = fullWidth
    ? movePointTowards(to, translatedControl2, 2)
    : movePointTowards(to, translatedControl2, STATE_CIRCLE_RADIUS)

  // Generate the path data
  const pathData = `M${edge1.x}, ${edge1.y} Q${control.x}, ${control.y} ${edge2.x}, ${edge2.y}`
  const textPathData = edge1.x < edge2.x
    ? `M${edge1.x}, ${edge1.y - TEXT_PATH_OFFSET} Q${control.x}, ${control.y - TEXT_PATH_OFFSET} ${edge2.x}, ${edge2.y - TEXT_PATH_OFFSET}`
    : `M${edge2.x}, ${edge2.y - TEXT_PATH_OFFSET} Q${control.x}, ${control.y - TEXT_PATH_OFFSET} ${edge1.x}, ${edge1.y - TEXT_PATH_OFFSET}`

  return { pathData, textPathData }
}


TransitionSet.Transition = Transition

export default TransitionSet
