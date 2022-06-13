import { styled } from 'goober'

export const Container = styled('div')`
  position: fixed;
  padding-block: .8em;
  background: var(--surface);
  min-width: 5em;
  min-height: 2em;
  pointer-events: none;
  border-radius: .3rem;
  transform: translate(-50%, -180%);

  > div > span {
    padding-inline: .8em;
  }

  &::before {
    display: block;
    content: '';
    width: 3em;
    aspect-ratio: 1;
    transform: translate(-50%, -70%) rotate(45deg);
    border-radius: 0.3rem;
    background: inherit;
    top: 100%;
    position: absolute;
    left: 50%;
    z-index: -1;
  }

  &.animate {
    transition: top .2s, left .2s;
  }
`

export const Content = styled('div')`
  display: flex;
  flex-direction: column;
  gap: .5em;
  position: relative;
  z-index: 1;
  background: inherit;
  overflow-x: hidden;
`

export const TickerTapeWrapper = styled('div')`
  --cell-width: 35px;
  overflow: hidden;
  max-width: calc(5 * var(--cell-width) + 1px);
`

export const TickerTape = styled('div')`
  display: flex;
  flex-direction: row;
  width: max-content;

  transform: translateX(calc(${p => -p.$index + 2} * var(--cell-width)));
  transition: transform .1s;
`

export const TickerTapeCell = styled('span')`
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

  &:not(:nth-last-child(1)) {
    border-left: 1px dashed var(--input-border);
  }
  &:last-of-type {
    border-right: 1px dashed var(--input-border);
  }

  ${p => p.$consumed && `
    color: var(--grey);
  `}
`

export const SerratedEdgeContainer = styled('div')`
  position: absolute;
  left: calc(-1 * var(--cell-width) / 3);
  min-width: calc(var(--cell-width) / 3);
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  overflow: hidden;
  height: 123%;
  transform: translateY(-19%);

  ${p => p.$flipped && `
    left: 100%;
    transform: translateY(-19%) rotateY(180deg);
  `}
`

export const Triangle = styled('div')`
  background: var(--white);
  transform: translate(70%, 10%) rotate(45deg);
  width: 100%;
  height: 150%;
`
