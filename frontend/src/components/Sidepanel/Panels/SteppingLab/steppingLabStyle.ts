import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0.8rem;
`

export const ButtonRow = styled('div')`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4em;
`
