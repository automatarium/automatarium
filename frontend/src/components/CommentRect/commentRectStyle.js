import { styled } from 'goober'
import { forwardRef } from 'react'

export const CommentContainer = styled('div', forwardRef)`
  color: var(--stroke);
  background: var(--grid-bg);
  padding: 1em;
  border-radius: .5rem;
  border: 2.5px solid var(--input-border);
  user-select: none;
  width: max-content;
  max-width: 255px;
  margin: auto;
  box-sizing: border-box;

  ${p => p.$selected && `
    border-color: var(--primary);
  `}
`
