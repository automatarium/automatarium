export const commentStyles = {
  color: 'var(--stroke)',
  background: 'var(--grid-bg)',
  padding: '1em',
  borderRadius: '.5rem',
  borderWidth: '2.5px',
  borderStyle: 'solid',
  borderColor: 'var(--input-border)',
  userSelect: 'none',
  width: 'max-content',
  maxWidth: '255px',
  boxSizing: 'border-box',
}

export const commentSelectedStyles = {
  ...commentStyles,
  borderColor: 'var(--primary)',
}
