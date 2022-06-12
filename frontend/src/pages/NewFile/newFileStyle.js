import { styled } from 'goober'

export const NoResultSpan = styled('span')`
  opacity: .5;
  font-style: italic;
`

export const HeaderRow = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;

  header { margin-bottom: 0; }
`

export const ButtonGroup = styled('div')`
  display: flex;
  gap: .8em;
`
