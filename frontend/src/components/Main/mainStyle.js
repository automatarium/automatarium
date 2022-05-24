import { styled } from 'goober'

export const MainContainer = styled('main')`
  max-width: 600px;
  width: 100%;
  padding: 1em 2em;
  box-sizing: border-box;
  margin: 0 auto;
  padding-bottom: 3em;

  ${p => p.$wide && `
    max-width: 1200px;
  `}

  ${p => p.$fullWidth && `
    max-width: initial;
    padding-inline: 0;
  `}
`
