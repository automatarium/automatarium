import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: .8rem;
  margin-block: .8rem;
  padding-inline: .8rem;
  overflow-x: auto;
`

export const Symbol = styled('div')`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 2em;
  aspect-ratio: 1 / 1;
  background: var(--toolbar);
  border-radius: .2rem;
  box-sizing: border-box;
  font-size: 1.1rem;
`

export const SymbolList = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: .4em;
`
