import React, { useState } from 'react'
import { styled } from 'goober'

interface LabInstructionsProps {
  questions: string[] // Array of questions for pagination
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

const PaginationWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`

const PaginationButton = styled('button')`
  background-color: var(--primary);
  color: var(--white);
  border: 1px solid var(--white);
  padding: 0.2em 0.5rem;
  cursor: pointer;
  margin: 0 4px;
  font-size: 14px;
  border-radius: 0.3em;

  &:hover {
    background-color: var(--white);
    color: var(--toolbar);
  }

  &:disabled {
    background-color: var(--surface);
    cursor: not-allowed;
  }
`

const LabInstructions: React.FC<LabInstructionsProps> = ({ questions }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [instructions, setInstructions] = useState(questions[currentQuestionIndex])

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value)
  }

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' ? currentQuestionIndex + 1 : currentQuestionIndex - 1
    setCurrentQuestionIndex(newIndex)
    setInstructions(questions[newIndex])
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
        <Title>Question {currentQuestionIndex + 1}</Title>
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
      {/* Pagination Buttons */}
      <PaginationWrapper>
        <PaginationButton
          onClick={() => handlePageChange('prev')}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </PaginationButton>
        <PaginationButton
          onClick={() => handlePageChange('next')}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </PaginationButton>
      </PaginationWrapper>
    </LabInstructionsWrapper>
  )
}

export default LabInstructions
