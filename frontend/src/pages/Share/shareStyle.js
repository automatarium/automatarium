import { styled } from 'goober'

export const Container = styled('div')`
  min-height: calc(100vh - 3em);
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  justify-content: center;

  gap: 2em;

  button { 
    min-width: 10em;
  }
`
