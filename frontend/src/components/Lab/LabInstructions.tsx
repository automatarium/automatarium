import React, { useState } from 'react'
import { styled } from 'goober'

interface LabInstructionsProps {
  instructions: string
}

const LabInstructionsWrapper = styled('div')`
  width: 250px;
  padding: 16px;
  background-color: var(--toolbar); /* Using the same color scheme */
  border-right: 1px solid var(--surface);
  height: 100%;
  overflow-y: auto;
  color: var(--white); /* Text color */
`

const TitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--surface);
  padding-bottom: 8px;
`

const Title = styled('h2')`
  margin: 0;
  color: var(--white); /* Title color */
`

const EditButton = styled('button')<{$active?: boolean}>`
  background-color: var(--primary);
  color: var(--white);
  border: 1px solid var(--primary);
  padding: 0.2em 0.5rem;
  cursor: pointer;
  font-size: 14px;
  border-radius: 0.3em;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background-color: var(--white);
    color: var(--toolbar);
  }

  ${props => props.$active && `
    background-color: var(--primary);
    color: var(--white);
  `}
`

const Content = styled('div')`
  margin-top: 30px;
`

const Textarea = styled('textarea')`
  width: 100%;
  height: 500px;
  background-color: var(--surface);
  color: var(--white);
  border: 1px solid var(--white);
  padding: 2px;
  font-size: 14px;
  border-radius: 0.3em;
  transition: background 0.3s, color 0.3s;
`

const LabInstructions: React.FC<LabInstructionsProps> = ({ instructions: initialInstructions }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [instructions, setInstructions] = useState(initialInstructions)

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value)
  }

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
        <EditButton $active={isEditing} onClick={toggleEdit}>
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
