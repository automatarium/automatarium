import { styled } from 'goober'
import { forwardRef } from 'react'

// I think I need to get rid of this.

const BottomBar = styled('sim')`
  background-color: var(--toolbar);
  color: var(--white);
  display: flex;
  flex-direction: row;
  position: relative;
  z-index: 2;  
`

export default BottomBar
