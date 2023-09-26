import { styled } from 'goober'

export const CardContainer = styled('button')<{$cardClass: string}>`
  margin: 3px;
  min-height: 240px;
  height: 360px;
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

  &:hover, &:focus {
    border: 3px solid var(--primary);
    outline: none;
  }

  display: flex;
  flex-direction: column;

  background: var(--toolbar);

  overflow: hidden;

  ${p => p.$cardClass === 'title-only' && `
    justify-content: space-around;
  `}
`

export const CardTitle = styled('div')`
  text-align: center;
  font-weight: bold;
  font-size: large;
  padding-top: 1em;
`

export const CardTitleAndText = styled('div')<{$cardClass: string}>`
  overflow: hidden;
  ${p => p.$cardClass === 'img-text' && `
    height: 50%;
  `}
  ${p => p.$cardClass === 'img-only' && `
    padding-bottom: 1em;
  `}
`

export const CardImage = styled('div')<{$cardClass: string}>`
  border-radius: .6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 50%;

  img {
    width: 100%;
    display: block;
    object-fit: contain;
  }

  ${p => p.$cardClass === 'text-only' && `
    background: var(--grid-pattern-light);
  `}
`
