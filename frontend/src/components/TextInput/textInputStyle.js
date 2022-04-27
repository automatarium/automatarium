import { styled } from 'goober'

export const StyledInput = styled('input')`
  font: inherit;
  border: 1px solid var(--border-color, var(--input-border));
  background: var(--white);
  border-radius: .3em;
  padding: .6em .9em;
  width: 100%;
  box-sizing: border-box;
  ${props => props.as === 'textarea' && 'resize: vertical;'}
  transition: box-shadow .1s, border-color .1s;
  color: var(--black);
  box-sizing: border-box;
  margin: 0;

  &:focus {
    outline: 0;
    box-shadow: inset 0 0 0 1px var(--border-color, var(--primary));
    border-color: var(--border-color, var(--primary));
  }

  ${p => p.$color === 'success' && `
    background: hsl(var(--success-h), 53%, 76%);
    --border-color: var(--success);
  `}
  ${p => p.$color === 'error' && `
    background: hsl(var(--error-h), 97%, 87%);
    --border-color: var(--error);
  `}
`
