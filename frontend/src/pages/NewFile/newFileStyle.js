import { styled } from 'goober'

export const NoResultSpan = styled('span')`
  opacity: .5;
  font-style: italic;
`

export const HeaderRow = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1em;
  flex-wrap: wrap;

  header { margin-bottom: 0; }
`

export const ButtonGroup = styled('div')`
  display: flex;
  gap: .8em;
`

export const PreferencesButton = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  height: 2em;
  width: 2em;
`
