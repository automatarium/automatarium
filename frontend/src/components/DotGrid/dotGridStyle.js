import { styled } from 'goober'

export const DotGridContainer = styled('g')`
  opacity: ${p => p['data-snapping'] ? 1 : 0};
  transition: opacity .15s;
`
