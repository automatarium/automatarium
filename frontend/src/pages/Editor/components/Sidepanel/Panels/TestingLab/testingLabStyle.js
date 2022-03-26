import { styled } from 'goober'

export const Title = styled('h1')`
  font-size: 1.5em;
`

export const Subtitle = styled('h2')`
  background-color: var(--toolbar);
  font-size: 1em;
  padding: 10px;
`

export const TraceInput = styled('input')`
  width: 90%;
  margin: 10px;
  border-radius: 5px;
  height: 1.5em;
`

export const TraceButtonContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 0 10px;
`

export const TraceButton = styled('button')`
  height: 2.3em;
  border-radius: 5px;
`

export const AddMultiTraceButton = styled('button')`
  width: 90%;
  height: 2em;
  margin: 10px;
  border-radius: 6px;
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