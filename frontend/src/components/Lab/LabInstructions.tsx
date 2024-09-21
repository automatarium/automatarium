import React, { useState, useEffect } from 'react';
import { styled } from 'goober';
import { useLabStore, useLabsStore, useProjectStore } from '/src/stores';

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
`;

const TitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--surface);
  padding-bottom: 8px;
`;

const Title = styled('h2')`
  margin: 0;
  color: var(--white); /* Title color */
`;

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
`;

const Content = styled('div')`
  margin-top: 30px;
`;

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
`;

const PaginationWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: auto; /* Ensures pagination sticks to the bottom */
  padding-top: 16px;
`;

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
`;

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
`;

const LabInstructions = () => {
  const { lab, upsertQuestion, upsertProject } = useLabStore();
  const questions = lab.questions;
  const total_questions = Object.keys(questions).length;
  const currentProject = useProjectStore(s => s.project);
  const currentQuestionIndex = lab.projects.indexOf(currentProject)
  const upsertLab = useLabsStore(s => s.upsertLab)
  const setProject = useProjectStore(s => s.set)

  

  const [isEditing, setIsEditing] = useState(false);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (lab) {
      setQuestion(questions[currentProject._id] || '');
    }
  }, [lab]);

  const saveLab = () => {
    const project = useProjectStore.getState().project
    upsertProject({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
    const lab = useLabStore.getState().lab
    upsertLab(lab)
  }

  const toggleEdit = () => {
    if (isEditing) {
      // Save the updated question via upsertQuestion
      const currentQuestionId = Object.keys(questions)[currentQuestionIndex];
      upsertQuestion(currentQuestionId, question);
      const lab = useLabStore.getState().lab
      upsertLab(lab)
    }
    setIsEditing(!isEditing);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handlePageChange = (index: number) => {
    saveLab()
    setProject(lab.projects[index])
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuestionIndex = parseInt(e.target.value, 10);
    handlePageChange(selectedQuestionIndex);
  };

  // If there are no questions or lab data yet, show a loading or fallback message
  if (!questions || total_questions === 0 || !lab) {
    return <LabInstructionsWrapper>Loading lab instructions...</LabInstructionsWrapper>;
  }

  const formattedInstructions = question.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <LabInstructionsWrapper>
      <div>
        <TitleWrapper>
          <Title>Question {currentQuestionIndex + 1}</Title>
          <EditButton $active={isEditing} onClick={toggleEdit}>
            {isEditing ? 'Save' : 'Edit'}
          </EditButton>
        </TitleWrapper>
        <hr />
        <Content>
          {isEditing ? (
            <Textarea
              value={question}
              onChange={handleQuestionChange}
              placeholder="Edit lab instructions here"
            />
          ) : (
            <>{formattedInstructions}</>
          )}
        </Content>
      </div>

      <PaginationWrapper>
        <PaginationButton
          onClick={() => handlePageChange(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        >
          &lt;
        </PaginationButton>

        <SelectBox value={currentQuestionIndex} onChange={handleSelectChange}>
          {Object.entries(questions).map(([id, question], index) => (
            <option key={id} value={index}>
              Question {index + 1}
            </option>
          ))}
        </SelectBox>

        <PaginationButton
          onClick={() => handlePageChange(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === total_questions - 1}
        >
          &gt;
        </PaginationButton>
      </PaginationWrapper>
    </LabInstructionsWrapper>
  );
};

export default LabInstructions;
