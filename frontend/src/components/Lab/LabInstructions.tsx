// LabInstructions.tsx
import React from 'react'
import { styled } from 'goober'

interface LabInstructionsProps {
  instructions: string
}

const LabInstructionsWrapper = styled('div')`
  padding: 16px;
  background-color: #f9f9f9;
  border-left: 1px solid #ddd;
  height: 100%;
  overflow-y: auto;
`

const LabInstructions: React.FC<LabInstructionsProps> = ({ instructions }) => {
  return (
    <LabInstructionsWrapper>
      <h2>Lab Instructions</h2>
      <div>{instructions}</div>
    </LabInstructionsWrapper>
  )
}

export default LabInstructions
