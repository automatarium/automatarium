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
`

export const State = styled('div')`
  background: hsl(var(--primary-h) var(--primary-s) 75%);
  border: 1px solid currentColor;
  border-radius: 100em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 2rem;
  width: 2rem;
  font-size: .8em;
  position: relative;

  ${props => props.$final && `
    &::after {
      content: '';
      position: absolute;
      inset: 2px;
      border-radius: inherit;
      border: inherit;
    }
  `}
`

export const StyledInitialArrow = styled('svg')`
  height: 2rem;

  polygon {
    fill: var(--white);
    stroke: currentColor;
    stroke-width: 1px;
  }
`

export const StyledTransition = styled('svg')`
  height: 2rem;

  path {
    fill: none;
    stroke: var(--success);
    ${props => props.$error && `stroke: var(--error);`}
    stroke-width: 2px;
    stroke-linecap: round;
  }
`
