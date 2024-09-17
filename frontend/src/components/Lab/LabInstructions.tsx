import React, { useState } from 'react'
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
  color: #fff; /* Change text color to white for better contrast */
`

const TitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ddd;
  padding-bottom: 8px;
`

const Title = styled('h2')`
  margin: 0;
`

const EditButton = styled('button')`
  background-color: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;

  &:hover {
    color: #aaa;
  }
`

const Content = styled('div')`
  margin-top: 30px; /* Space between the line and content */
`

const Textarea = styled('textarea')`
  width: 100%;
  height: 100px;
  background-color: #3C3C3C;
  color: #fff;
  border: 1px solid #ddd;
  padding: 8px;
  font-size: 14px;
`

const LabInstructions: React.FC<LabInstructionsProps> = ({ instructions: initialInstructions }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [instructions, setInstructions] = useState(initialInstructions)

  // Toggle between view and edit modes
  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  // Handle the change when editing
  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value)
  }

  // Convert newline characters to <br> tags for display mode
  const formattedInstructions = instructions.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ))

  return (
    <LabInstructionsWrapper>
      <TitleWrapper>
        <Title>Question 1</Title>
        <EditButton onClick={toggleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </EditButton>
      </TitleWrapper>
      <Content>
        {isEditing ? (
          <Textarea
            value={instructions}
            onChange={handleInstructionsChange}
          />
        ) : (
          formattedInstructions
        )}
      </Content>
    </LabInstructionsWrapper>
  )
}

export default LabInstructions
