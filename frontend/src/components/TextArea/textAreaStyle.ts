import { forwardRef } from 'react'
import { styled } from 'goober'

export type InputColor = 'success' | 'error'

export const StyledTextArea = styled('textarea', forwardRef)`
  font: inherit;
  border: 1px solid var(--border-color, var(--input-border));
  background: var(--white);
  border-radius: .3em;
  padding: .6em .9em;
  width: 100%;
  min-height: 125px;
  box-sizing: border-box;
  ${props => props.as === 'textarea' && 'resize: vertical;'}
  transition: box-shadow .1s, border-color .1s;
  color: var(--black);
  margin: 0;

  &:focus {
    outline: 0;
    box-shadow: inset 0 0 0 1px var(--border-color, var(--primary));
    border-color: var(--border-color, var(--primary));
  }
`
