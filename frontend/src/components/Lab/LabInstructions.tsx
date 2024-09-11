import React from 'react'
import { styled } from 'goober'

interface LabInstructionsProps {
  instructions: string
}

const LabInstructionsWrapper = styled('div')`
  width: 250px;  /* Set the desired width */
  padding: 16px;
  background-color: #2C2C2C;
  border-right: 1px solid #ddd; /* Adjust the border if needed */
  height: 100%;
  overflow-y: auto;
`

const Title = styled('h2')`
  margin: 0;
  padding-bottom: 8px; /* Space between title and line */
  border-bottom: 2px solid #ddd; /* Line under the title */
`

const Content = styled('div')`
  margin-top: 30px; /* Space between the line and content */
`

const LabInstructions: React.FC<LabInstructionsProps> = ({ instructions }) => {
  // Convert newline characters to <br> tags
  const formattedInstructions = instructions.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ))

  return (
    <LabInstructionsWrapper>
      <Title>Question 1</Title>
      <Content>{formattedInstructions}</Content>
    </LabInstructionsWrapper>
  )
}

export default LabInstructions
