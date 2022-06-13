import { styled } from 'goober'

export const Wrapper = styled('div')`
  background: var(--white);
  color: var(--black);
  border-start-start-radius: .3em;
  border-start-end-radius: .3em;
  padding: .6em;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow-x: auto;
  width: 100%;
`

export const StyledState = styled('svg')`
  height: 2rem;
  min-width: 2rem;

  circle {
    stroke: currentColor;
    stroke-width: 1px;
    fill: var(--state-bg-light);
  }
  text {
    font-size: 1.2em;
  }
`

export const StyledInitialArrow = styled('svg')`
  height: 2rem;
  min-width: 1rem;

  polygon {
    fill: var(--white);
    stroke: currentColor;
    stroke-width: 1px;
  }
`

export const StyledTransition = styled('svg')`
  height: 2rem;
  min-width: 1.6rem;

  path {
    fill: none;
    stroke: var(--success);
    ${props => props.$error && `stroke: var(--error);`}
    stroke-width: 2px;
    stroke-linecap: round;
  }
`
