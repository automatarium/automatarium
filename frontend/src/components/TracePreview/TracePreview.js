import { Fragment, useRef, useState, useEffect } from 'react'

import { Wrapper, StyledState, StyledInitialArrow, StyledTransition } from './tracePreviewStyle'

const InitialArrow = () => (
  <StyledInitialArrow viewBox="0 0 14 32">
    <polygon points="14,16 2,0 2,32" />
  </StyledInitialArrow>
)

const Transition = ({ error }) => (
  <StyledTransition viewBox="0 0 25 32" $error={error}>
    {!error && <path d="M0 16 L24 16 m-7 -7 l7 7 l-7 7" />}
    {error && <path d="M0 16 L22 16 m-7 -7 l7 7 l-7 7 M24 8 l0 16" />}
  </StyledTransition>
)

const State = ({ final, children }) => {
  const textRef = useRef()
  const [box, setBox] = useState({})

  useEffect(() => setBox(textRef.current?.getBBox()), [textRef.current])

  return (
    <StyledState viewBox="0 0 32 32">
      <circle r="15" cx="50%" cy="50%" />
      {final && <circle r="12" cx="50%" cy="50%" />}
      <svg preserveAspectRatio="xMinYMin" viewBox={`0 0 ${Math.max(box.width ?? 0, 32)} ${Math.max(box.width ?? 0, 32)}`} width="70%" x="15%" y="15%">
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

const TracePreview = ({
  trace,
  step,
  states,
  statePrefix = 'q',
  ...props
}) => (
  <Wrapper {...props}>
    {trace.trace.slice(0, step + 1).map((item, i) => <Fragment key={i}>
      {item.read === null && i === 0 && <InitialArrow />}
      <State final={i + 1 === trace.trace.length && trace.accepted}>
        {states?.find(s => s.id === item.to)?.name ?? statePrefix + item.to}
      </State>
      {((i < step || (!trace.accepted && trace.transitionCount === step)) && (trace.trace.length > 1 || !trace.accepted)) && <Transition
        error={i + 1 === trace.trace.length}
      />}
    </Fragment>)}
  </Wrapper>
)

export default TracePreview
