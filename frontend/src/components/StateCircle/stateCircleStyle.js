import { styled } from 'goober'

export const StyledCircle = styled('circle')`
  fill: hsl(var(--primary-h) var(--primary-s) 75%);
  stroke: var(--black);

  + text {
    user-select: none;
  }

  ${p => p.$selected && `
    filter: brightness(.7);
  `}
` 
