import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: .8rem;
  margin: .8rem;
`

export const StepButtons = styled('div')`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: .4em;
`

export const TraceConsole = styled('code')`
  background: var(--toolbar);
  display: block;
  border-radius: .3em;
  box-sizing: border-box;
  padding: .5rem .7rem;

  pre {
    margin: 0;
  }
`

export const AddMultiTraceButton = styled('button')`
  width: 90%;
  height: 2em;
  margin: 10px;
  border-radius: 6px;
  border: none;
  outline: none;
`

export const MultiTraceWrapper = styled('div')`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
  margin: 10px;
`

export const MultiTraceInput = styled('input')`
  font-size: 1em;
`

export const RemoveMultiTraceInputButton = styled('button')`
  
`

export const RunMultiTraceInputButton = styled('button')`
  width: 90%;
  height: 2em;
  margin: 10px;
  border-radius: 6px;
`