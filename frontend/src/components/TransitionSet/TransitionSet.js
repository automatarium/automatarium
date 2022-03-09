import { useContext } from 'react'

import { MarkerContext } from '/src/providers'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'
import { movePointTowards, lerpPoints, size } from '/src/util/points'

import { StyledPath } from './transitionSetStyle'

const TransitionSet = ({ transitions }) => <>
  { transitions.map(({from, to}, i) => <Transition i={i} from={from} to={to} key={[i, from, to]} />) }
</>

const Transition = ({ i, from, to }) => {
  const { standardArrowHead } = useContext(MarkerContext)

  // TODO: for now im gonna use straight lines but eventially we need to
  // compute control points. Thats why this is a transition set,
  // because the control points need to be determined such that the edges don't overlap.
  //
  // Im imagining of a system that starts with the control points centered between the two states
  // and then slowly pushes the control points outwards along the normal to the line between the
  // two states

  // We connect the transitions to the closest point on the circle rather than the center
  const edge1 = movePointTowards(from, to, STATE_CIRCLE_RADIUS)
  const edge2 = movePointTowards(to, from, STATE_CIRCLE_RADIUS)

  // Generate the path data
  const controlPoint = lerpPoints(from, to, .5) // TEMP // TODO
  const pathData = `M${edge1.x}, ${edge1.y} L${edge2.x}, ${edge2.y}`
  
  return <>
     {/*The edge itself*/}
     <StyledPath d={pathData} key={pathData} markerEnd={`url(#${standardArrowHead})`} />
  </>
}

export default TransitionSet
