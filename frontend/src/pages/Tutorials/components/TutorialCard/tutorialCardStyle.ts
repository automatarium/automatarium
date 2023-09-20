import { styled } from 'goober'

export const CardContainer = styled('button')`
  margin: 3px;
  min-height: 240px;
  min-width: 366px;
  width: 20em;

  border-radius: .5rem;
  border: 3px solid transparent;
  overflow: hidden;
  user-select: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  padding: 0;
  text-align: left;

  padding: 6px;

  &:hover:not(:disabled), &:focus {
    border: 3px solid var(--primary);
    outline: none;
  }

  display: flex;
  flex-direction: column;
  flex-wrap: flex-start;

  background: var(--toolbar);
`

export const CardTitle = styled('div')`
  text-align: center;
  font-weight: bold;
  font-size: large;
  padding-top: 1em;
`

export const CardImage = styled('div')<{$image?: boolean}>`
  border-radius: .6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 50%;

  svg {
    width: 60%;
    height: 60%;
    aspect-ratio: inherit;
    display: block;
  }
  img {
    height: 100%;
    width: 100%;
    display: block;
    object-fit: contain;
  }

  ${props => !props.$image && `
    background: var(--white);
  `}
`
