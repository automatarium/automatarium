import { styled } from 'goober'
import { forwardRef } from 'react'

export const CommentContainer = styled('div', forwardRef)`
  color: black;  
  background: white;
  padding: 1em;
  border-radius: .5rem;
  border: 2.5px solid var(--input-border);
  user-select: none;
`
