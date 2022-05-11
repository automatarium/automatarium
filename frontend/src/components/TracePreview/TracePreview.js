import { Wrapper, State, StyledInitialArrow, StyledTransition } from './tracePreviewStyle'

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

const TracePreview = ({
  trace,
  step,
  ...props
}) => (
  <Wrapper {...props}>
    {trace.trace.slice(0, step+1).map((item, i) => <>
      {item.read === null && i === 0 && <InitialArrow />}
      <State $final={i+1 === trace.trace.length && trace.accepted}>q{item.to}</State>
      {(i < step || (!trace.accepted && trace.transitionCount === step)) && <Transition
        error={i+1 === trace.trace.length}
      />}
    </>)}
  </Wrapper>
)

export default TracePreview
