import { styled } from 'goober'

export const StyledDetails = styled('details')`
  summary {
    > .chevron-down { display: initial; }
    > .chevron-up { display: none; }
  }

  &[open] {
    summary {
      > .chevron-down { display: none; }
      > .chevron-up { display: initial; }
    }
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    user-select: none;
    cursor: pointer;
  }
`
