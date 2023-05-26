import { createPortal } from 'react-dom'
import { useState, useEffect, useMemo } from 'react'
import { useProjectStore, useViewStore } from '/src/stores'

import {
  Container,
  TickerTape,
  TickerTapeCell
} from './traceStepBubbleStyle'
import { SerratedEdge, Pointer } from '/src/components/TMTraceStepWindow/TMTraceStepWindow'
import { AutomataState } from '/src/types/ProjectTypes'

interface TraceStepBubbleProps {
  stateID: number
  input: string
  index: number
}

const TraceStepBubble = ({ stateID, input, index }: TraceStepBubbleProps) => {
  const [targetState, setTargetState] = useState<AutomataState>()
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

export default TraceStepBubble
