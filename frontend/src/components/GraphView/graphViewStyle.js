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
    background: var(--grid-pattern);
  `}

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
