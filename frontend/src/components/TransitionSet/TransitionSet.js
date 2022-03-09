import { useContext } from 'react'

import { MarkerContext } from '/src/providers'
import { STATE_CIRCLE_RADIUS } from '/src/config/rendering'

import { StyledPath } from './transitionSetStyle'

const TransitionSet = ({ transitions }) => <>
  { transitions.map(([p1, p2], i) => <Transition i={i} p1={p1} p2={p2} key={[i, p1, p2]} />) }
</>

const Transition = ({ i, p1, p2 }) => {
  const { standardArrowHead } = useContext(MarkerContext)

  console.log(standardArrowHead)

  // TODO: for now im gonna use straight lines but eventially we need to
  // compute control points. Thats why this is a transition set,
  // because the control points need to be determined such that the edges don't overlap.
  //
  // Im imagining of a system that starts with the control points centered between the two states
  // and then slowly pushes the control points outwards along the normal to the line between the
  // two states

  // We connect the transitions to the closest point on the circle rather than the center
  const p1Edge = movePointTowards(p1, p2, STATE_CIRCLE_RADIUS)
  const p2Edge = movePointTowards(p2, p1, STATE_CIRCLE_RADIUS)

  console.log({p1Edge, p2Edge})

  // Generate the path data
  const controlPoint = lerpPoints(p1, p2, .5) // TEMP // TODO
  const pathData = `M${p1Edge.cx}, ${p1Edge.cy} L${p2Edge.cx}, ${p2Edge.cy}`
  
  return <>
     {/*The edge itself*/}
     <StyledPath d={pathData} key={pathData} markerEnd={`url(#${standardArrowHead})`} />
  </>
}

const lerpPoints = (p1, p2, t) => ({
  cx: p1.cx + t * (p2.cx - p1.cx),
  cy: p1.cy + t * (p2.cy - p1.cy),
})

const movePointTowards = (p, tar, d) => {
  const l = size({cx: tar.cx - p.cx, cy: tar.cy - p.cy})
  return {
    cx: p.cx + d * (tar.cx - p.cx) / l,
    cy: p.cy + d * (tar.cy - p.cy) / l,
  }
} 

const size = p =>
  Math.sqrt(Math.pow(p.cx, 2) + Math.pow(p.cy, 2))

export default TransitionSet
