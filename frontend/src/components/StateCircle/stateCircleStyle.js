import { styled } from 'goober'

export const StyledCircle = styled('circle')`
  fill: hsl(var(--primary-h) var(--primary-s) 75%);
  stroke: var(--black);

  + text {
    user-select: none;
  }

  ${p => p.$selected && `
    fill: hsl(var(--primary-h) 75% 64%);
    stroke: hsl(var(--primary-h) var(--primary-s) 45%);
    stroke-width: 3px;
  `}
` 
