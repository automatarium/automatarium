import { Fragment, useRef, useState, useEffect, HTMLAttributes, ReactNode } from 'react'

import { Wrapper, StyledState, StyledInitialArrow, StyledTransition } from './tracePreviewStyle'
import {
  FSAExecutionResult, PDAExecutionResult
} from '@automatarium/simulation/src/graph'
import { AutomataState } from '/src/types/ProjectTypes'

const InitialArrow = () => (
  <StyledInitialArrow viewBox="0 0 14 32">
    <polygon points="14,16 2,0 2,32" />
  </StyledInitialArrow>
)

const Transition = ({ error }: { error: boolean}) => (
  <StyledTransition viewBox="0 0 25 32" $error={error}>
    {!error && <path d="M0 16 L24 16 m-7 -7 l7 7 l-7 7" />}
    {error && <path d="M0 16 L22 16 m-7 -7 l7 7 l-7 7 M24 8 l0 16" />}
  </StyledTransition>
)

const State = ({ final, children }: { final: boolean, children: ReactNode }) => {
  const textRef = useRef<SVGTextElement>()
  const [box, setBox] = useState<DOMRect>()

  useEffect(() => setBox(textRef.current?.getBBox()), [textRef.current])
  const width = Math.max(box?.width ?? 0, 32)
  return (
    <StyledState viewBox="0 0 32 32">
      <circle r="15" cx="50%" cy="50%" />
      {final && <circle r="12" cx="50%" cy="50%" />}
      <svg preserveAspectRatio="xMinYMin" viewBox={`0 0 ${width} ${width}`} width="70%" x="15%" y="15%">
        <text
          ref={textRef}
          textAnchor="middle"
          alignmentBaseline="central"
          x="50%" y="50%"
        >{children}</text>
      </svg>
    </StyledState>
  )
}

interface TracePreviewProps extends HTMLAttributes<HTMLDivElement>{
  // TracePreview isn't implemented for TM's (I don't know why) so we only allow FSA and PDA.
  // Implementing should be simple, I think the issue was the item.read === null check not working (since TMs dont have that)
  result: (FSAExecutionResult | PDAExecutionResult) & {transitionCount: number}
  step: number
  states: AutomataState[]
  statePrefix?: string
}

const TracePreview = ({
  result,
  step,
  states,
  statePrefix = 'q',
  ...props
}: TracePreviewProps) => (
  <Wrapper {...props}>
    {result.trace.slice(0, step + 1).map((item, i) => <Fragment key={i}>
      {item.read === null && i === 0 && <InitialArrow />}
      <State final={i + 1 === result.trace.length && result.accepted}>
        {states?.find(s => s.id === item.to)?.name ?? statePrefix + item.to}
      </State>
      {((i < step || (!result.accepted && result.transitionCount === step)) && (result.trace.length > 1 || !result.accepted)) && <Transition
        error={i + 1 === result.trace.length}
      />}
    </Fragment>)}
  </Wrapper>
)

export default TracePreview
