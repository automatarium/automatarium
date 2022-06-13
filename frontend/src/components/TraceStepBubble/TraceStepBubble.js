import { createPortal } from 'react-dom'
import { useState, useEffect, useMemo } from 'react'
import { useProjectStore, useViewStore } from '/src/stores'

import {
  Container,
  Content,
  TickerTape,
  TickerTapeWrapper,
  TickerTapeCell,
  SerratedEdgeContainer,
  Triangle,
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
      <Container style={{ left: position[0], top: position[1] }} className={transitionsEnabled ? 'animate' : 'no-animate'}>
        <Content>
          <TickerTapeWrapper>
            <TickerTape $index={index}>
              <SerratedEdge />
              {input.split('').map((symbol, i) => <TickerTapeCell key={i} $consumed={i < index}>
                {symbol}
              </TickerTapeCell>)}
              <SerratedEdge flipped />
            </TickerTape>
          </TickerTapeWrapper>
        </Content>
      </Container> 
    }
  </>, document.querySelector('#editor-panel-wrapper'))
}

const SerratedEdge = ({ flipped }) => <SerratedEdgeContainer $flipped={flipped}>
  <Triangle />
  <Triangle />
  <Triangle />
  <Triangle />
  <Triangle />
</SerratedEdgeContainer>

export default TraceStepBubble
