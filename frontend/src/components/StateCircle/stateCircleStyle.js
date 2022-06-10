import { styled } from 'goober'

export const StyledCircle = styled('circle')`
  fill: var(--state-bg);
  stroke: var(--stroke);

  + text {
    user-select: none;
    fill: var(--stroke);
  }

  ${p => p.$selected && `
    stroke: var(--primary);
    stroke-width: 2.5px;
    filter: brightness(.85) saturate(1.4);
  `}
`
