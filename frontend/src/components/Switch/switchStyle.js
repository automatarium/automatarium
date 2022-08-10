import { styled } from 'goober'
import { forwardRef } from 'react'

export const SwitchInput = styled('input', forwardRef)`
  height: 0;
  width: 0;
  border: 0;
  margin: 0;
  padding: 0;
  font-size: 0;
  opacity: 0;
  position: absolute;
`

export const StyledSwitch = styled('div')`
  height: 25px;
  width: 45px;
  min-width: 45px;
  box-sizing: border-box;
  background-color: var(--disabled-button);
  border: 3px solid var(--disabled-button);
  border-radius: 10em;
  transition: box-shadow .1s, background-color .1s, border-color .1s;
  position: relative;
  cursor: pointer;

  div {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    background-color: var(--white);
    border-radius: 10em;
    transform: translate(0, -50%);
    height: 100%;
    aspect-ratio: 1 / 1;
    transition: background-color .15s, padding .15s, transform .15s;
  }

  input:checked + & {
    background-color: var(--primary);
    border-color: var(--primary);

    div {
      transform: translate(100%, -50%);
    }
  }
  input:focus-visible + & {
    box-shadow: 0 0 0 2px var(--primary);
  }
`
