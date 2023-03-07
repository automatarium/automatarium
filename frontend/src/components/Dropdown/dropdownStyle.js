import { styled } from 'goober'
import { forwardRef } from 'react'

export const Wrapper = styled('div', forwardRef)`
  background: var(--surface);
  border-radius: .3em;
  padding: .4em 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 1000;
  font-size: .95rem;
  transition: opacity .15s, transform .15s, visibility .15s;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-.2em);

  & > div {
    position: relative;
  }

  ${props => props.$subMenu && `
    position: absolute;
    top: -.4em;
    left: calc(100% - .2em);
    transform: translateX(-.2em) translateY(0);
  `}

  ${props => props.$visible && `
    opacity: 1;
    transform: translateX(0) translateY(0);
    pointer-events: all;
    visibility: visible;
  `}
`

export const Shortcut = styled('span')`
  opacity: .5;
`

export const ItemWrapper = styled('button')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  padding: .2em .8em;
  margin: 0;
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
  gap: 1em;
  width: 100%;

  &:hover, &:focus ${props => props.$active && ',&'} {
    background: var(--primary);
  }

  &:disabled, &:disabled:hover {
    background: none;
    cursor: default;

    label, svg {
      opacity: .5;
    }
  }

  label {
    cursor: inherit;
  }
`

export const Divider = styled('hr')`
  border: 0;
  margin: .3em 0;
  border-top: 1px solid var(--toolbar);
`
