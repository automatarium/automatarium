import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  align-items: flex-start;

  & > div {
    flex-grow: 1;
    min-width: 180px;
  }
`

export const Image = styled('img')`
  background-color: hsl(0 0% 50%);
  display: block;
  flex: 1000;
  border-radius: .3em;
  min-width: 300px;
`
