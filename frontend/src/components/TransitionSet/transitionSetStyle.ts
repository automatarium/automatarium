import { css } from 'goober'

export const pathStyles = {
  stroke: 'var(--stroke)',
  fill: 'none'
}

export const ghostStyles = {
  stroke: 'var(--stroke)',
  fill: 'none',
  opacity: 0.3
}

export const pathSelectedClass = css`
  stroke: var(--primary) !important;
`
