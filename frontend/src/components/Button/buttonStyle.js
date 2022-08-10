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
  display: inline-flex;
  justify-content: center;
  align-items: center;
  appearance: none;
  gap: .5em;
  text-decoration: none;

  &:active {
    filter: brightness(0.94);
  }

  &:disabled {
    filter: none;
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

  ${props => props.$surface && `
    background-color: var(--surface);
  `}
`
