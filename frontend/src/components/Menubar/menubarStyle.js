import { forwardRef } from 'react'
import { styled } from 'goober'

export const Wrapper = styled('nav')`
  background-color: var(--toolbar);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  position: relative;
`

export const Menu = styled('div')`
  display: flex;
  align-items: center;
  gap: 0em;
  flex: 1;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`
export const NameRow = styled('div')`
  display: flex;
  align-items: center;
  gap: .5em;
`

export const Name = styled('span')`
  display: block;
  font-size: 1.2em;
  padding: .2em .5rem;
`

export const NameInput = styled('input', forwardRef)`
  font: inherit;
  font-size: 1.2em;
  padding: .2em .5rem;
  border: 0;
  border-radius: .3em;
`

export const SaveStatus = styled('span')`
  position: relative;
  font-size: .8em;
  opacity: 0;
  transition: opacity .3s;
  padding-left: 1.8em;
  user-select: none;
  pointer-events: none;

  ${p => p.$show && `
    opacity: .75;
  `}

  @keyframes spin { to { transform: rotate(360deg); } }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: calc(50% - .6em);
    height: 1.2em;
    width: 1.2em;
    border-radius: 10em;
    box-sizing: border-box;
    border: 2px solid currentColor;
    border-block-end: 2px solid transparent;
    animation: spin 1s linear infinite;
  }
`

export const Actions = styled('div')`
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 1em;
`

export const DropdownMenus = styled('div')`
  display: flex;
  gap: .1em;
`

export const DropdownButtonWrapper = styled('button', forwardRef)`
  font: inherit;
  margin: 0;
  color: inherit;
  background: none;
  border: 0;
  padding: .2em .5rem;
  cursor: pointer;
  font-size: .95em;
  border-radius: .2em;

  &:hover ${props => props.$active && `,&`} {
    background: var(--surface);
  }
`
