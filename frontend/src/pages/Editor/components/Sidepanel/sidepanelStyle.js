import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  position: relative;
`

export const Panel = styled('div')`
  min-width: 350px;
  height: 100%;
  overflow-y: auto;
  background: var(--surface);
  position: absolute;
  right: 100%;
  z-index: 10;
`

export const Heading = styled('h2')`
  font-size: 1.2em;
  font-weight: 600;
  margin: .8em 1em .8em 2em;
`
