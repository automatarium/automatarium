import { css } from 'goober'

export const commentStyles = {
  color: 'var(--comment-text)',
  background: 'var(--grid-bg)',
  padding: '.8em 1em',
  borderRadius: '.5rem',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: 'var(--input-border)',
  userSelect: 'none',
  width: 'max-content',
  maxWidth: '255px',
  boxSizing: 'border-box'
} as const

export const commentSelectedClass = css`
  border-color: var(--primary) !important;
`
