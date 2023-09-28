import { styled } from 'goober'

export const Container = styled('div')`
  --cell-width: 35px;
  --tape-background: var(--toolbar);
  flex: 1;
  position: relative;
  padding-block: .8em;
  background: var(--toolbar);
  min-width: calc(var(--cell-width) * 21);
  pointer-events: none;
  border-radius: .3rem;
  &.animate {
    transition: top .2s, left .2s;
  }

  & > div {
    overflow: hidden;
  }
`

export const TickerTapeContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self:start;
`

// Involves spooky math function for transform. Pen and paper type stuff.
export const TickerTape = styled('div')<{$tapeLength: number, $index: number, $inTransition: boolean}>`
  display: flex;
  flex-direction: row;
  transform: translateX(calc((${p => p.$tapeLength - 1}/2) * var(--cell-width) + ${p => -p.$index} * var(--cell-width)));
  width: max-content;
  ${p => p.$inTransition && `
    transition: transform .2s;
  `}
`

export const TickerTapeCell = styled('span')`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-width: var(--cell-width);
  font-family: monospace;
  font-size: 1.2em;
  box-sizing: border-box;
  background: var(--white);
  color: var(--black);
  border-left: 1px dashed var(--input-border);

  &:last-of-type {
    border-right: 1px dashed var(--input-border);
  }
`

export const SerratedEdgeContainer = styled('svg')<{$flipped?: boolean}>`
  position: absolute;
  right: 100%;
  top: 0;
  bottom: 0;
  height: 100%;

  ${p => p.$flipped && `
    right: initial;
    left: 100%;
    transform: rotate(180deg);
  `}
`

export const PointerContainer = styled('svg')`
  position: absolute;
  left: calc(50% - 8px);
  top: 6px;
  height: 12px;
  width: 16px;
  z-index: 1;
`
