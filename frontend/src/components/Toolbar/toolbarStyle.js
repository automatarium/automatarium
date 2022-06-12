import { styled } from 'goober'

export const ToolPopup = styled('div')`
  background: var(--toolbar);
  border-radius: .3em;
  overflow: hidden;
  position: absolute;
  top: ${props => props.$y ?? 85}px;
  left: 5rem;
  z-index: 5;
  max-width: 200px;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition: opacity .15s, visibility .15s;

  &.visible {
    opacity: 1;
    visibility: visible;
  }

  img {
    display: block;
    height: 4rem;
    background-color: var(--input-border);
  }

  & > div {
    padding: .6em .8em;

    & > span {
      font-size: .875em;
    }
  }
`

export const ToolName = styled('div')`
  display: flex;
  align-items: center;
  gap: .5em;
  margin-block-end: .2em;
  font-weight: 600;
`

export const ToolHotkey = styled('span')`
  font-weight: 400;
  display: inline-block;
  padding: .2em .4em;
  color: var(--input-border);
  border: 1px solid currentColor;
  border-radius: .3em;
  font-size: .7em;
`