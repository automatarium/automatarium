import { styled } from 'goober'

export const Wrapper = styled('label')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block: .75em;

  ${props => props.$fullWidth && `
    flex-direction: column;
    gap: .2em;
    align-items: flex-start;

    select, input {
      width: 100%;
    }
  `}
`

export const Description = styled('span')`
  display: block;
  font-size: .75em;
  opacity: .5;
`
