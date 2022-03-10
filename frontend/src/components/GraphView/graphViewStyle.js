import { forwardRef } from 'react'
import { styled } from 'goober'

export const Svg = styled('svg', forwardRef)`
  background: var(--white);
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 2px;
`
