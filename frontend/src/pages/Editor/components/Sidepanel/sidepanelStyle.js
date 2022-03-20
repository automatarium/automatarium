import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  position: relative;
`

export const Panel = styled('div')`
  min-width: 300px;
  height: 100%;
  overflow-y: auto;
  background: var(--surface);
  position: absolute;
  right: 100%;
  z-index: 10;
`