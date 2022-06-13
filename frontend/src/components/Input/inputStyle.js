import { styled } from 'goober'
import { forwardRef } from 'react'

export const StyledInput = styled('input', forwardRef)`
  font: inherit;
  border: 1px solid var(--border-color, var(--input-border));
  background: var(--white);
  border-radius: .3em;
  padding: .6em .9em;
  width: 100%;
  box-sizing: border-box;
  ${props => props.as === 'textarea' && 'resize: vertical;'}
  transition: box-shadow .1s, border-color .1s;
  color: var(--black);
  box-sizing: border-box;
  margin: 0;

  &:focus {
    outline: 0;
    box-shadow: inset 0 0 0 1px var(--border-color, var(--primary));
    border-color: var(--border-color, var(--primary));
  }

  ${p => p.$color === 'success' && `
    background: hsl(var(--success-h), 53%, 76%);
    --border-color: var(--success);
  `}
  ${p => p.$color === 'error' && `
    background: hsl(var(--error-h), 97%, 87%);
    --border-color: var(--error);
  `}

  ${p => p.$small && `
    width: initial;
    padding: .4em .5em;
    font-size: .875em;
  `}
`

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

export const StyledSwitch = styled('input')`
  height: 20px;
  width: 40px;
  min-width: 40px;
  box-sizing: border-box;
  background-color: var(--disabled-button);
  border: 2px solid var(--disabled-button);
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
`
