import { forwardRef } from 'react'
import { styled } from 'goober'

export const Label = styled('label', forwardRef)`
  text-transform: uppercase;
  font-size: .75em;
  font-weight: 600;
  letter-spacing: .1em;
  background: var(--toolbar);
  color: var(--input-border);
  display: block;
  padding: .7em .8rem;
`
