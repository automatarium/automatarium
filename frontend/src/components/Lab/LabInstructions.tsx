import React, { useState } from 'react'
import { styled } from 'goober'

interface LabInstructionsProps {
  questions: string[] // Array of questions for pagination
}

const LabInstructionsWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Pushes pagination to the bottom */
  width: 250px;
  padding: 16px;
  background-color: var(--surface); /* Using the same color scheme */
  border-right: 1px solid var(--surface);
  height: 86vh;
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
  align-items: center;
  gap: 8px;
  margin-top: auto; /* Ensures pagination sticks to the bottom */
  padding-top: 16px;
`

const PaginationButton = styled('button')`
  background-color: var(--primary);
  color: var(--white);
  border: 1px solid var(--white);
  padding: 0.2em 0.5rem;
  cursor: pointer;
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

const SelectBox = styled('select')`
  background-color: var(--surface);
  color: var(--white);
  border: 1px solid var(--white);
  padding: 0.2em;
  font-size: 14px;
  border-radius: 0.3em;
  cursor: pointer;

  &:hover {
    background-color: var(--white);
    color: var(--toolbar);
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

  const handlePageChange = (index: number) => {
    setCurrentQuestionIndex(index)
    setInstructions(questions[index])
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuestion = parseInt(e.target.value, 10)
    handlePageChange(selectedQuestion)
  }

  const formattedInstructions = instructions.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ))

  return (
    <LabInstructionsWrapper>
      <div>
        <TitleWrapper>
          <Title>Question {currentQuestionIndex + 1}</Title>
          <EditButton $active={isEditing} onClick={toggleEdit}>
            {isEditing ? 'Save' : 'Edit'}
          </EditButton>
        </TitleWrapper><hr />
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
      </div>
      
      <PaginationWrapper>
        {/* Move back "<" */}
        <PaginationButton
          onClick={() => handlePageChange(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        >
          &lt;
        </PaginationButton>

        {/* Select box to choose a question */}
        <SelectBox
          value={currentQuestionIndex}
          onChange={handleSelectChange}
        >
          {questions.map((_, index) => (
            <option key={index} value={index}>
               {index + 1}
            </option>
          ))}
        </SelectBox>

        {/* Move forward ">" */}
        <PaginationButton
          onClick={() => handlePageChange(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          &gt;
        </PaginationButton>
      </PaginationWrapper>
    </LabInstructionsWrapper>
  )
}

export default LabInstructions
