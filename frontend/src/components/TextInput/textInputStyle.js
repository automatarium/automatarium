import { styled } from 'goober'

export const StyledInput = styled('input')`
  font: inherit;
  border: 1px solid var(--input-border);
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
    box-shadow: inset 0 0 0 1px var(--primary);
    border-color: var(--primary);
  }
`
