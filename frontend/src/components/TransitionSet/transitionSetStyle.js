import { styled } from 'goober'

export const StyledPath = styled('path')`
  stroke: var(--stroke);
  fill: none;

  ${p => p.$selected && `
    stroke: var(--primary);
  `}
`
