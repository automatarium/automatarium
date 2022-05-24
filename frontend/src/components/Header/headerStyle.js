import { styled } from 'goober'

export const HeaderContainer = styled('header')`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  font-family: var(--font-feature);
  gap: 1em;

  ${p => p.$center && `
    justify-content: center;
  `}
`
