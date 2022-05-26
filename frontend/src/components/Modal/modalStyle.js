import { styled } from 'goober'
import { forwardRef } from 'react'

export const Container = styled('div', forwardRef)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  opacity: 1;
  visibility: visible;
  transition: opacity .15s, visibility .15s;
  overflow-y: auto;
  padding: 2em 0;

  &[aria-hidden='true'] {
    opacity: 0;
    visibility: hidden;
  }

  /* @media (max-width: ${mobileBP}) {
    padding: 0;
  } */
`

export const Overlay = styled('div', forwardRef)`
  position: fixed;
  inset: 0;
  background: rgba(0 0 0 / .5);
`

export const Content = styled('div', forwardRef)`
  margin: auto;
  z-index: 2;
  position: relative;
  background: var(--surface);
  border-radius: 1em;
  width: 700px;
  max-width: 100%;
  box-sizing: border-box;
  padding: 1.2em 1em 1em;

  transform: translateY(0);
  transition: transform .15s;

  [aria-hidden='true'] & {
    transform: translateY(5px);
  }

  /* @media (max-width: ${mobileBP}) {
    border-radius: 0;
  } */
`

export const Buttons = styled('div')`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1em;
`
