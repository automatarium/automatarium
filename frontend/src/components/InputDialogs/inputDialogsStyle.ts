import { styled } from 'goober'

export const InputWrapper = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
`

export const SubmitButton = styled('button')`
  position: absolute;
  padding: 0;
  margin: 0;
  right: .4em;
  top: 0;
  bottom: 0;
  border: 0;
  background: none;
  font: inherit;
  color: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  cursor: pointer;
`
