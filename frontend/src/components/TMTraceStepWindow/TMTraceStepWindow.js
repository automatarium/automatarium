import { createPortal } from 'react-dom'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useProjectStore, useViewStore } from '/src/stores'
import { useState } from 'react'

import {
    Container,
    TickerTapeContainer,
    TickerTape,
    TickerTapeCell,
    SerratedEdgeContainer,
    PointerContainer,
} from './tmTraceStepWindowStyle'

const TMTraceStepWindow = ( {trace, pointer, accepted, isEnd} ) => {

    const [green, setGreen] = useState(false)
    const [red, setRed] = useState(false)
    const containerRef = useRef()

    useEffect( () => {
        if (accepted && isEnd) {
            setGreen(true)
            setRed(false)
        }
        else if (isEnd && !accepted){
            setGreen(false)
            setRed(true)
        }
        else {
            setGreen(false)
            setRed(false)
        }
    }, [accepted, isEnd])


    return (
        <>
        {trace.length &&
        <Container style={{background: green ? '#689540' : red ? '#d30303' : 'var(--toolbar)'}} >
            <div>
                <Pointer />
                <TickerTapeContainer>
                    <TickerTape $index={pointer} $tapeLength={trace.length} >
                        <SerratedEdge />
                            {trace.map((symbol, i) => <TickerTapeCell key={i}>
                                {symbol}
                            </TickerTapeCell>)}
                        <SerratedEdge flipped />
                    </TickerTape>
                </TickerTapeContainer>
            </div>
        </Container>
        }
    </>
    )
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

export default TMTraceStepWindow;
