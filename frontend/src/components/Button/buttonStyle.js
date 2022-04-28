import { styled } from 'goober'

export const Wrapper = styled('button')`
  margin: 0;
  padding: .5em 1.2em;
  border: 0;
  background: var(--primary);
  font: inherit;
  color: var(--white);
  font-weight: 600;
  font-size: .9em;
  border-radius: .3em;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  appearance: none;
  gap: .5em;

  &:active {
    background-color: hsl(var(--primary-h) var(--primary-s) 47%);
  }

  &:disabled {
    background-color: var(--disabled-button);
    opacity: .8;
    cursor: default;
  }

  ${props => props.$icon && `
    padding: .375em;
  `}

  ${props => props.$secondary && `
    background-color: var(--toolbar);
  `}
`
