import { styled } from 'goober'

export const Container = styled('div')`
  --cell-width: 35px;

  position: fixed;
  padding-block: .8em;
  background: var(--surface);
  width: calc(var(--cell-width) * 5);
  pointer-events: none;
  border-radius: .3rem;
  transform: translate(-50%, -180%);
  transform-origin: bottom;

  &::before {
    display: block;
    content: '';
    width: 2em;
    aspect-ratio: 1;
    transform: translate(-50%, -70%) rotate(45deg);
    border-radius: .3rem;
    background: inherit;
    top: 100%;
    position: absolute;
    left: 50%;
  }

  &.animate {
    transition: top .2s, left .2s;
  }

  & > div {
    overflow: hidden;
  }
`

export const TickerTape = styled('div')<{$index: number}>`
  display: flex;
  flex-direction: row;
  width: max-content;

  transform: translateX(calc(${p => -p.$index + 4} * var(--cell-width)));
  transition: transform .1s;
`

export const TickerTapeCell = styled('span')<{$consumed?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-width: var(--cell-width);
  font-family: monospace;
  font-size: 1.2rem;
  box-sizing: border-box;
  background: var(--white);
  color: var(--black);
  border-left: 1px dashed var(--input-border);

  &:last-of-type {
    border-right: 1px dashed var(--input-border);
  }

  ${p => p.$consumed && `
    color: #CCC;
  `}
`
