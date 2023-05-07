import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: .8rem;
`

export const StepButtons = styled('div')`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .4em;
`

export const TraceConsole = styled('code')`
  background: var(--toolbar);
  display: block;
  border-end-end-radius: .3em;
  border-end-start-radius: .3em;
  box-sizing: border-box;
  padding: .5rem .7rem;

  pre {
    margin: 0;
  }
`
