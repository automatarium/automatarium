import { styled } from 'goober'

export const DotGridContainer = styled('g')`
  opacity: ${p => p['data-snapping'] ? 1 : 0};
  transition: opacity .15s;
`

export const DotGridCircle = styled('circle')`
  fill: var(--black);
  opacity: .1;
  stroke: none;
`
