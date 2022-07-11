import { styled } from 'goober'

export const CardContainer = styled('button')`
  display: grid;
  grid-template-rows: 1.3fr 1fr;
  box-sizing: border-box;
  min-width: 18em;
  width: 20em;

  border-radius: .5rem;
  border: 3px solid transparent;
  overflow: hidden;
  user-select: none;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  padding: 0;
  text-align: left;

  &:hover:not(:disabled), &:focus {
    border: 3px solid var(--primary);
    outline: none;
  }

  &:disabled {
    cursor: default;
    opacity: .7;
  }
`

export const CardContent = styled('div')`
  background: var(--toolbar);
  padding: .9em;

  > p {
    margin: 0;
    margin-top: .5em;
    font-size: .9rem;
  }
`

export const CardImage = styled('div')`
  height: 100%;
  background: var(--grid-pattern-light);
  background-size: 1.875em 1.875em;
  background-position: .4375em .4375em;
  position: relative;

  ${p => p.$disabled && `
    position: relative;
    &::after {
      content: 'Coming Soon';
      display: flex;
      align-items: center;
      justify-content: center;
      color: grey;
      font-size: 1.7rem;
      opacity: .4;
      position: absolute;
      inset: 0;
      font-family: var(--font-feature);
    }
  `}

  img, svg {
    display: block;
    object-fit: contain;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
`
