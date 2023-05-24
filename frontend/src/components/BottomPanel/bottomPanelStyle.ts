import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  position: relative;
  width: 100%
`
// In the future if multiple tapes are used, can make the height reliant on the tapes. Something like:
// 100 + (0.8 * (x * 100)) perhaps, where x is the number of tapes (simResults.length)
export const Panel = styled('div')`
  width: 100%;
  height: 180px;
  background: var(--surface);
  position: relative;
  z-index: 10;

  & > div {
    position: absolute;
    inset: 0;
    overflow-x: auto;
  }
`

export const Heading = styled('h2')`
  font-size: 1.2em;
  font-weight: 600;
  margin: .8em 1em .8em 2em;
  align: left;
`

export const CloseButton = styled('button')`
  position: absolute;
  top: .6em;
  z-index: 15;
  left: -1em;
  height: 2em;
  width: 2em;
  font: inherit;
  color: inherit;
  background: var(--toolbar);
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: .3em;
  cursor: pointer;
`
