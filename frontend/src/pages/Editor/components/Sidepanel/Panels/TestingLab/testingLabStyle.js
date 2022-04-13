import { styled } from 'goober'
import { Trash2 } from 'lucide-react'

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
  height: 2.5em;
  border-radius: 6px;
  border: none;
  outline: none;
  cursor: pointer;
`

export const MultiTraceWrapper = styled('div')`
  display: flex;
  height: 2rem;
  gap: 10px;
`

export const MultiTraceInput = styled('input')`
  /* background-color: var(--white); */
  width: 85%;
  background-color: ${p => p.accepted === undefined ? 'var(--white)' :
    p.accepted ? 'var(--success)' : 'var(--error)'};
  color: var(--black);
  border: none;
  border: solid .1rem;
  border-radius: .25rem;
  border-color: var(--input-border);

  font-size: 1em;
`

export const RemoveMultiTraceInputButton = styled(Trash2)`
  align-self: center;
  cursor: pointer;

`

export const RunMultiTraceInputButton = styled('button')`
  font-weight: bold;
  height: 2.75em;
  border: none;
  border-radius: 6px;
  background-color: var(--primary);
  cursor: pointer;

  &:active {
    background-color: hsl(var(--primary-h) var(--primary-s) 47%);
  }
`