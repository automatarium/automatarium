import { styled } from 'goober'
import React from 'react'

export const Wrapper = styled('div')`
  display: flex;
  position: relative;
  width: 100%
`

export const Panel = styled('div')`
  width: 100%;
  height: 300px;
  background: var(--surface);
  position: relative;
  z-index: 10;

  & > div {
    position: absolute;
    inset: 0;
    overflow-x: auto;
  }
`

export const Heading = styled('h2')`
  font-size: 1.2em;
  font-weight: 600;
  margin: .8em 1em .8em 2em;
  align: left;
`

export const CloseButton = styled('button')`
  position: absolute;
  top: .6em;
  z-index: 15;
  left: -1em;
  height: 2em;
  width: 2em;
  font: inherit;
  color: inherit;
  background: var(--toolbar);
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: .3em;
  cursor: pointer;
`
