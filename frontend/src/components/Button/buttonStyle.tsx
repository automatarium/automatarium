import { css } from 'goober'

type WrapperProps = {
  $icon: boolean
  $surface: boolean
  $secondary: boolean
}

/**
 * Creates a wapper element. This is done to support thr `as` prop with typescript
 */
export const ButtonStyleClass = ({ $icon, $secondary, $surface }: WrapperProps) =>
  css({
    margin: 0,
    border: 0,
    font: 'inherit',
    fontWeight: 600,
    fontSize: '.9em',
    borderRadius: '.3em',
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    appearance: 'none',
    gap: '.5em',
    textDecoration: 'none',

    color: $secondary || $surface ? 'var(--text)' : 'var(--white)',
    padding: $icon ? '.375em' : '.5em 1.2em',


    backgroundColor: $secondary
      ? 'var(--toolbar) !important'    
      : $surface
      ? 'var(--surface) !important'    
      : 'var(--primary) !important',   

    // Hover styles
    '&:hover': $secondary
      ? { backgroundColor: 'var(--toolbar)' }
      : $surface
      ? { backgroundColor: 'var(--surface)' }
      : { filter: 'brightness(0.96)' },

    '&:active': { filter: 'brightness(0.94)' },
    '&:disabled': {
      filter: 'none',
      backgroundColor: 'var(--disabled-button)',
      opacity: 0.8,
      cursor: 'default'
    },
    '&:focus-visible': {
      outline: '2px solid var(--focus)',
      outlineOffset: '2px'
    }
  })
