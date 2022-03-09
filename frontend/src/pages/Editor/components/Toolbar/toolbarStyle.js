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
  padding: .2em;
  gap: .3em;
  flex: 1;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .3em;
  }
`

export const Name = styled('span')`
  display: block;
  font-size: 1.2em;
`

export const DropdownMenus = styled('div')`
  display: flex;
  gap: .3em;
`

export const Actions = styled('div')`
  display: flex;
  gap: .5em;
  padding: .5em;
`