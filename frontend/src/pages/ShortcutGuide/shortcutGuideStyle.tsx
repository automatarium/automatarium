import { styled } from 'goober'

export const Section = styled('section')`
  padding: .2rem 1rem;
`

export const Shortcut = styled('div')`
  padding-block: .5em;
  display: flex;
  align-items: center;
  gap: .5em;

  label {
    flex: 1;
  }

  kbd {
    background: var(--surface);
    border-radius: 5px;
    border: 2px solid var(--toolbar);
    box-shadow: 0 4px 0 var(--toolbar);
    font: inherit;
    display: inline-block;
    padding: .2em .4em;
    white-space: nowrap;
    font-size: 1rem;
    user-select: none;
    text-align: center;
    min-width: 1.5ch;
    transition: transform .15s, box-shadow .15s;

    &:active {
      transform: translateY(4px);
      box-shadow: 0 0 0 var(--toolbar);
    }
  }
`
