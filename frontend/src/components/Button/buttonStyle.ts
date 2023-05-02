import { css } from 'goober'

type WrapperProps = {
  $icon: boolean
  $surface: boolean
  $secondary: boolean
}

/**
 * Creates a wapper element. This is done to support thr `as` prop with typescript
 */
export const ButtonStyleClass = ({ $icon, $secondary, $surface }: WrapperProps) => css({
  margin: 0,
  border: 0,
  background: 'var(--primary)',
  font: 'inherit',
  color: 'var(--white)',
  fontWeight: '600',
  fontSize: '.9em',
  borderRadius: '.3em',
  cursor: 'pointer',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  appearance: 'none',
  gap: '.5em',
  textDecoration: 'none',
  '&:active': {
    filter: 'brightness(0.94)'
  },
  '&:disabled': {
    filter: 'none',
    backgroundColor: 'var(--disabled-button)',
    opacity: '.8',
    cursor: 'default'
  },
  padding: $icon ? '.375em' : '.5em 1.2em',
  backgroundColor: $secondary ? 'var(--toolbar)' : $surface ? 'var(--surface)' : undefined
})
