import { useCallback, useEffect, useState } from 'react'

import {
  Container,
  PointerContainer,
  SerratedEdgeContainer,
  TickerTape, TickerTapeCell,
  TickerTapeContainer
} from './tmTraceStepWindowStyle'

interface TMTraceStepWindowProps {
  trace: string[]
  pointer: number
  accepted: boolean
  isEnd: boolean
}

const TMTraceStepWindow = ({ trace, pointer, accepted, isEnd }: TMTraceStepWindowProps) => {
  const [green, setGreen] = useState(false)
  const [red, setRed] = useState(false)

  const [boxWidth, setBoxWidth] = useState(760)
  const [tapeTrace, setTapeTrace] = useState(trace)
  const [effectiveIndex, setEffectiveIndex] = useState(0)
  const [effectiveEnd, setEffectiveEnd] = useState(trace.length)

  const [lastPointer, setLastPointer] = useState(0)
  const [inTransition, setInTransition] = useState(true)

  const startTransition = (newTrace: string[], newEnd: number) => {
    setInTransition(true)
    setTimeout(() => {
      // This will snap the tape so it doesn't do the steering jitter
      setInTransition(false)
      setTapeTrace(newTrace)
      setEffectiveEnd(newEnd)
    }, 20)
  }
  // INCREASE THE POINTER, WAIT THEN UPDATE THE TAPE

  const updateWidth = useCallback(() => {
    // Magic numbers come from the size of toolbar, min size of canvas and size of side panel
    const minSize = 398 + 760 + 64
    const usableWidth = window.innerWidth < minSize ? 760 : window.innerWidth - 398 - 64
    setBoxWidth(usableWidth)
  }, [window.innerWidth])

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    // Some offsets so the tape looks slightly more continuous
    const offset = 2
    const endOffset = 2
    const startOffset = 1
    const maxTapeLength = Math.floor(boxWidth / 35) - offset - endOffset - startOffset
    if (trace.length > maxTapeLength) {
      // Pointer is at the midpoint so calc the number of cells to get
      const halfFit = Math.ceil(maxTapeLength / 2)

      const canSeeStart = pointer - startOffset <= halfFit
      const canSeeEnd = trace.length - pointer < halfFit + endOffset

      const start = canSeeStart ? 0 : pointer - halfFit - startOffset
      const end = canSeeEnd ? trace.length : halfFit + pointer + endOffset

      // Save the last pointer to determine if you headed left or right
      const right = lastPointer <= pointer
      setLastPointer(pointer)
      setEffectiveIndex(pointer - start)
      if (!canSeeStart && !canSeeEnd) {
        // If headed right remove from end, else remove from start
        setTapeTrace(trace.slice(right ? start : start - 1, right ? end - 1 : end))
        // The css function should now run the transition,
        // after the timeout the state will be updated and the animation finished
        startTransition(trace.slice(start, end), end)
      } else {
        // If we can see the start or end, it is clear the tape is moving
        setInTransition(true)
        setTapeTrace(trace.slice(start, end))
        setEffectiveEnd(end)
      }
    } else {
      // If the tape fits do the normal thang
      setInTransition(true)
      setTapeTrace(trace)
      setEffectiveIndex(pointer)
      setEffectiveEnd(trace.length)
    }
  }, [boxWidth, pointer, trace])

  useEffect(() => {
    setGreen(isEnd && accepted)
    setRed(isEnd && !accepted)
  }, [accepted, isEnd])
  return (
    <Container style={{ background: green ? '#689540' : red ? '#d30303' : 'var(--toolbar)' }} >
      <div>
        <Pointer />
        <TickerTapeContainer>
          <TickerTape $index={effectiveIndex} $tapeLength={tapeTrace.length} $inTransition={inTransition}>
            {effectiveIndex === pointer && <SerratedEdge />}
              {tapeTrace.map((symbol, i) => <TickerTapeCell key={i}>
                {symbol}
              </TickerTapeCell>)}
            {trace.length === effectiveEnd && <SerratedEdge flipped />}
          </TickerTape>
        </TickerTapeContainer>
      </div>
    </Container>
  )
}

export const SerratedEdge = ({ flipped }: { flipped?: boolean}) => (
    <SerratedEdgeContainer viewBox="0 0 7.3 50" $flipped={flipped}>
        <polygon fill="var(--white)" points="7.28 50 0 50 7.28 43.75 0 37.53 7.3 31.25 .02 25 7.3 18.75 .02 12.5 7.3 6.25 .02 0 7.3 0 7.28 50"/>
    </SerratedEdgeContainer>
)

export const Pointer = () => (
    <PointerContainer viewBox="0 0 20 15">
        <path fill="var(--primary)" d="M2.45,0h15.1c2.05,0,3.19,2.37,1.91,3.97l-7.55,10.11c-.98,1.23-2.85,1.23-3.83,0L.54,3.97C-.74,2.37,.4,0,2.45,0Z"/>
    </PointerContainer>
)

export default TMTraceStepWindow
