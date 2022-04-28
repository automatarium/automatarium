import { styled } from 'goober'

export const StyledCircle = styled('circle')`
  fill: hsl(var(--primary-h) var(--primary-s) 75%);
  stroke: var(--black);

  + text {
    user-select: none;
  }

  ${p => p.$selected && `
    fill: hsl(var(--primary-h) 75% 65%);
    stroke: hsl(var(--primary-h) var(--primary-s) var(--primary-l));
    stroke-width: 3px;
  `}
` 
