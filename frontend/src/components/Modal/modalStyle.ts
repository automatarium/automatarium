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
`

export const Overlay = styled('div', forwardRef)`
  position: fixed;
  inset: 0;
  background: rgba(0 0 0 / .5);

  .dropdown & {
    background: transparent;
  }
`

export const Content = styled('div', forwardRef)`
  margin: auto;
  z-index: 2;
  position: relative;
  background: var(--surface);
  border-radius: 1em;
  width: 500px;
  max-width: calc(100% - 40px);
  box-sizing: border-box;
  box-shadow: 0 2px 5px rgba(0 0 0 / .5);

  transform: translateY(0);
  transition: transform .15s;

  [aria-hidden='true'] & {
    transform: translateY(5px);
  }
  [aria-hidden='true'].dropdown & {
    transform: translateY(-5px);
  }
`

export const Children = styled('div')`
  padding: .8rem 1rem 1rem;
`

export const Heading = styled('h2')`
  padding: 1rem 1rem 0;
  margin-block: 0 .2rem;
`

export const Description = styled('span')`
  display: block;
  padding-inline: 1rem;
  opacity: .5;
`

export const Buttons = styled('div')`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--toolbar);
`
