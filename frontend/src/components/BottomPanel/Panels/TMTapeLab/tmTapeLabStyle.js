import { styled } from 'goober'

export const Wrapper = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-wrap: wrap;
  gap: .8rem;
  margin: .8rem;
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

export const MultiTraceRow = styled('div')`
  display: flex;

  & input {
    flex: 1;
  }

  & button {
    max-width: 0;
    padding: 0;
    margin-left: 0;
  }
  &:focus-within button {
    max-width: 4em;
    padding: 0 .5em;
    margin-left: .2em;
  }
`

export const RemoveButton = styled('button')`
  background: none;
  border: 0;
  appearance: none;
  color: inherit;
  font: inherit;
  padding: 0;
  margin: 0;
  display: block;
  cursor: pointer;
  overflow: hidden;
  transition: max-width .15s, padding .15s, margin-left .15s;
`

export const StatusIcon = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: .8em;
  color: var(--error);

  ${props => props.$accepted && `
    color: var(--success);
  `}
`

export const WarningLabel = styled('div')`
  display: flex;
  margin: .8rem;
  border-radius: .3rem;
  padding: .5em;
  gap: .5em;
  align-items: center;
  background: var(--error);
`
