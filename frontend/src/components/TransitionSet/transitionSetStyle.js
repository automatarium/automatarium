import { styled } from 'goober'

export const StyledPath = styled('path')`
  stroke: var(--black);
  fill: none;

  ${p => p.$selected && `
    stroke: var(--primary);
  `}
`
