import { createPortal } from 'react-dom'
import { useState, useEffect, useMemo } from 'react'
import { useProjectStore, useViewStore } from '/src/stores'

import {
  Container,
  TickerTape,
  TickerTapeCell,
  SerratedEdgeContainer,
  PointerContainer,
} from './traceStepBubbleStyle'

const TraceStepBubble = ({ stateID, input, index }) => {
  const [targetState, setTargetState] = useState()
  const [transitionsEnabled, setTransitionsEnabled] = useState(false)
  const viewToScreenSpace = useViewStore(s => s.viewToScreenSpace)
  const states = useProjectStore(s => s.project?.states)
  const viewPosition = useViewStore(s => s.position)
  const viewScale = useViewStore(s => s.scale)
  const viewSize = useViewStore(s => s.size)

  // Update state from ID
  useEffect(() => {
    setTargetState(states.find(s => s.id === stateID))
  }, [stateID, states])

  // Determine location on screen
  const position = useMemo(() => targetState && viewToScreenSpace(targetState.x, targetState.y), [targetState, viewPosition, viewScale, viewSize])

  useEffect(() => {
    setTransitionsEnabled(true)
    setTimeout(() => setTransitionsEnabled(false), 300)
  }, [stateID, index])

  return createPortal(<>
    {position &&
      <Container style={{ left: position[0], top: position[1] }} className={transitionsEnabled ? 'animate' : ''}>
        <div>
          <Pointer />
          <TickerTape $index={index}>
            <SerratedEdge />
            {input?.split('').map((symbol, i) => <TickerTapeCell key={i} $consumed={i < index}>
              {symbol}
            </TickerTapeCell>)}
            <SerratedEdge flipped />
          </TickerTape>
        </div>
      </Container>
    }
  </>, document.querySelector('#editor-panel-wrapper'))
}

const SerratedEdge = ({ flipped }) => (
  <SerratedEdgeContainer viewBox="0 0 7.3 50" $flipped={flipped}>
    <polygon fill="var(--white)" points="7.28 50 0 50 7.28 43.75 0 37.53 7.3 31.25 .02 25 7.3 18.75 .02 12.5 7.3 6.25 .02 0 7.3 0 7.28 50"/>
  </SerratedEdgeContainer>
)

const Pointer = () => (
  <PointerContainer viewBox="0 0 20 15">
    <path fill="var(--primary)" d="M2.45,0h15.1c2.05,0,3.19,2.37,1.91,3.97l-7.55,10.11c-.98,1.23-2.85,1.23-3.83,0L.54,3.97C-.74,2.37,.4,0,2.45,0Z"/>
  </PointerContainer>
)

export default TraceStepBubble
