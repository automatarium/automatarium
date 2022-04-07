import { useContext } from 'react'

import { MarkerContext } from '/src/providers'
import { STATE_CIRCLE_RADIUS, TRANSITION_SEPERATION } from '/src/config/rendering'
import { movePointTowards, lerpPoints, size } from '/src/util/points'

import { StyledPath } from './transitionSetStyle'

const TransitionSet = ({ transitions }) => <>
  { transitions.map(({from, to, read}, i) => (
    <Transition i={i} count={transitions.length} text={read} from={from} to={to} key={`${i} ${from.x} ${to.x} ${from.y} ${to.y}`} />)
  )}
</>

const Transition = ({ i, count, from, to, text }) => {
  const { standardArrowHead } = useContext(MarkerContext)

  // TODO: for now im gonna use straight lines but eventially we need to
  // compute control points. Thats why this is a transition set,
  // because the control points need to be determined such that the edges don't overlap.
  //
  // Im imagining of a system that starts with the control points centered between the two states
  // and then slowly pushes the control points outwards along the normal to the line between the
  // two states

  // Determine how much to bend this path
  const middleValue = count % 2 == 0 ? count / 2 : count / 2 + .5
  const bendValue = TRANSITION_SEPERATION * (count > 1 ? middleValue - (i+1) : 0) / 2

  // Determine control position 
  // -- this is determined by moving along the normal to the difference between the states
  // -- with the distance moved controled by the `bend` value 
  const center = lerpPoints(from, to, .5)
  const tangent = { x: to.x - from.x, y: to.y - from.y }
  const a = Math.PI/2
  const orth = { x: tangent.x * Math.cos(a) - tangent.y * Math.sin(a), y: tangent.x * Math.sin(a) + tangent.y * Math.cos(a) }
  const normal = { x: orth.x / size(orth), y: orth.y / size(orth) }
  const control = { x: center.x + bendValue * normal.x, y: center.y + bendValue * normal.y }

  // We connect the edge to the closest point on each circle from the control point
  const edge1 = movePointTowards(from, control, STATE_CIRCLE_RADIUS)
  const edge2 = movePointTowards(to, control, STATE_CIRCLE_RADIUS)
  
  // Generate the path data
  const pathData = `M${edge1.x}, ${edge1.y} Q${control.x}, ${control.y} ${edge2.x}, ${edge2.y}`
  const textPathOffset = 5
  const textPathData = edge1.x < edge2.x
    ? `M${edge1.x}, ${edge1.y - textPathOffset} Q${control.x}, ${control.y - textPathOffset} ${edge2.x}, ${edge2.y - textPathOffset}`
    : `M${edge2.x}, ${edge2.y - textPathOffset} Q${control.x}, ${control.y - textPathOffset} ${edge1.x}, ${edge1.y - textPathOffset}`

  // Generate a unique id for this path
  // -- used to place the text on the same path
  const pathID = `${i}${from.x}${from.y}${to.x}${to.y}`
  
  return <>
     {/*The edge itself*/}
     <StyledPath id={pathID} d={pathData} key={pathID} markerEnd={`url(#${standardArrowHead})`} />
     <path id={`${pathID}-text`} d={textPathData} key={`${pathID}-text`} stroke='none' fill='none' />

     {/* The label - i.e the accepted symbols*/}
     <text>
       <textPath startOffset="50%" textAnchor="middle" alignmentBaseline="bottom" xlinkHref={`#${pathID}-text`}>
        {text}
       </textPath>
     </text>
  </>
}

export default TransitionSet
