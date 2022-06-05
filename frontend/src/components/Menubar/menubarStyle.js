import { forwardRef } from 'react'
import { styled } from 'goober'

export const Wrapper = styled('nav')`
  background-color: var(--toolbar);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export const Name = styled('span')`
  display: block;
  font-size: 1.2em;
  padding: .2em .5rem;
  cursor: pointer;
`

export const NameRow = styled('div')`
  display: flex;
  align-items: center;
  gap: .2em;
`

export const SaveStatus = styled('span')`
  font-style: italic;
  opacity: .2;
  transition: opacity .5s;

  ${p => !p.$show && `
    opacity: 0; 
  `}
`

export const Actions = styled('div')`
  display: flex;
  align-items: center;
  gap: .5em;
  padding: 1em;
`

export const ButtonGroup = styled('div')`
  display: flex;
  align-items: center;
  gap: .5em;
  margin-inline-end: .75em;
  
  span {
    font-size: .8rem;
  }
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
