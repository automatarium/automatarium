import { styled } from 'goober'
import { forwardRef } from 'react'

const Sidebar = styled('nav')`
  background-color: var(--toolbar);
  color: var(--white);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;

  ${props => props.$tools && `
    & > button {
      min-width: 4rem;
    }
  `}
`

Sidebar.Button = styled('button', forwardRef)`
  background: none;
  font: inherit;
  color: inherit;
  border: 0;
  cursor: pointer;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  min-width: 3rem;
  gap: .1em;

  &:hover {
    background: var(--surface);
  }

  &:active ${props => props.$active && `,&,&:hover`} {
    background: var(--primary);
  }
`

export default Sidebar
