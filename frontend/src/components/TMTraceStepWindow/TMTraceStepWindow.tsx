import { useState, useEffect, useRef, useCallback } from 'react'

import {
  Container,
  TickerTapeContainer,
  TickerTape,
  TickerTapeCell,
  SerratedEdgeContainer,
  PointerContainer
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
  const [boxWidth, setBoxWidth] = useState(900)
  const [tapeTrace, setTapeTrace] = useState(trace)

  const tapeRef = useRef<HTMLDivElement>()

  const onContainerResize = useCallback(() => {
    const boundingBox = tapeRef.current?.getBoundingClientRect()
    if (boundingBox) setBoxWidth(boundingBox.width)
  }, [])

  useEffect(() => {
    if (tapeRef.current) {
      const resizeObserver = new ResizeObserver(onContainerResize)
      resizeObserver.observe(tapeRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [tapeRef.current])

  /**
   * Number that can fit into BB, BBFit = bbWidth / 35
   * If at the start we have slice(0, BBFit/2)
   * If at the end we have slice(trace.length - BBFit/2, trace.length - 1)
   * start = If pointer > BBFit/2 then pointer - BBFit/2 else pointer
   * end = If trace.length - pointer < BBFit/2 then trace.length - 1
   */
  useEffect(() => {
    const maxTapeLength = Math.floor(boxWidth / 35) - 3
    console.log(`Culled: ${tapeTrace.length} Full: ${trace.length} Max: ${maxTapeLength}`)
    if (trace.length > maxTapeLength) {
      const halfFit = Math.floor(maxTapeLength / 2)
      const start = pointer > halfFit ? pointer - halfFit : 0
      const end = trace.length - pointer < halfFit + 3 ? trace.length - 1 : halfFit + pointer + 3
      console.log(`${pointer} => ${start}, ${end}`)
      setTapeTrace(trace.slice(start, end))
    } else {
      setTapeTrace(trace)
    }
  }, [boxWidth, pointer, trace])

  useEffect(() => {
    setGreen(isEnd && accepted)
    setRed(isEnd && !accepted)
  }, [accepted, isEnd])
  return (
        <Container style={{ background: green ? '#689540' : red ? '#d30303' : 'var(--toolbar)' }} >
            <div ref={tapeRef}>
                <Pointer />
                <TickerTapeContainer>
                    <TickerTape $index={pointer} $tapeLength={tapeTrace.length} >
                        <SerratedEdge />
                            {tapeTrace.map((symbol, i) => <TickerTapeCell key={i}>
                                {symbol}
                            </TickerTapeCell>)}
                        <SerratedEdge flipped />
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
