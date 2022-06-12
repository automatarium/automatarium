import { forwardRef } from 'react'
import { styled } from 'goober'

export const Wrapper = styled('div', forwardRef)`
  flex: 1;
  position: relative;
`

export const Svg = styled('svg', forwardRef)`
  position: absolute;
  inset: 0;
  display: block;
  background: var(--grid-bg);

  /* Grid */
  ${p => p.$showGrid && `
    --dot-fraction: 12.5%;
    background: radial-gradient(
      var(--grid-dot),
      var(--grid-dot) var(--dot-fraction),
      var(--grid-bg) var(--dot-fraction));
  `};

  /* Text */
  text {
    user-select: none;
    -webkit-user-select: none; /* for safari */
  }

  /* Cursors */
  ${p => p.$tool === 'hand' && `
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  `}
`
