import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  position: relative;
  width: 100%
`
export const Panel = styled('div')`
  width: 100%;
  background: var(--surface);
  position: relative;
  z-index: 10;

  & > div {
    inset: 0;
    overflow-x: auto;
  }
`
