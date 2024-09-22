import React, { useState, useEffect, useRef } from 'react';
import { useLabStore, useLabsStore, useProjectStore } from '/src/stores';
import { 
  LabWindowWrapper, 
  Textarea, 
  PaginationWrapper, 
  PaginationButton, 
  SelectBox, 
  ResizeHandle, 
  CloseButton, 
  TitleWrapper, 
  Title, 
  EditButton, 
  Content 
} from './labWindowStyling';

const LabWindow = () => {
  const currentLab = useLabStore(s => s.lab)
  const updateQuestion = useLabStore(s => s.upsertQuestion)
  const updateProject = useLabStore(s => s.upsertProject)
  const questions = currentLab.questions;
  const total_questions = Object.keys(questions).length;
  const currentProject = useProjectStore(s => s.project);
  const currentQuestionIndex = currentLab.projects.findIndex(project => project._id === currentProject._id)
  const updateLab = useLabsStore(s => s.upsertLab)
  const setProject = useProjectStore(s => s.set)

  const [panelWidth, setPanelWidth] = useState('250px');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { setShowLabWindow } = useLabStore();   

  const [isEditing, setIsEditing] = useState(false);
  const [question, setQuestion] = useState('');

  const handleMouseDown = (e: React.MouseEvent) => {
    // Start the resizing process
    const startX = e.clientX;
    const startWidth = panelRef.current ? panelRef.current.offsetWidth : 250;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setPanelWidth(`${newWidth}px`);
    };

    const handleMouseUp = () => {
      // Clean up event listeners after resizing
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleClose = () => {
    setShowLabWindow(false); // Close the lab panel
  };
  
  useEffect(() => {
    if (currentLab) {
      setQuestion(questions[currentProject._id] || '');
    }
  }, [currentLab]);

  const saveLab = () => {
    const project = useProjectStore.getState().project
    updateProject({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
    updateLab(currentLab)
  }

  const handleEditClick = () => {
    if (isEditing) {
      // Update question
      const currentQuestionId = Object.keys(questions)[currentQuestionIndex];
      updateQuestion(currentQuestionId, question);
      updateLab(currentLab)
    }
    setIsEditing(!isEditing);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handlePageChange = (index: number) => {
    saveLab()
    setProject(currentLab.projects[index])
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuestionIndex = parseInt(e.target.value, 10);
    handlePageChange(selectedQuestionIndex);
  };

  // If there are no questions or lab data yet, show a loading or fallback message
  if (!questions || total_questions === 0 || !currentLab) {
    return <LabWindowWrapper width={panelWidth}>Loading lab instructions...</LabWindowWrapper>;
  }

  const formattedInstructions = question.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    
    <LabWindowWrapper ref={panelRef} width={panelWidth}>
      <CloseButton onClick={handleClose}>x</CloseButton>
      <div>
        <TitleWrapper>
          <Title>Question {currentQuestionIndex + 1}</Title>
          <EditButton $active={isEditing} onClick={handleEditClick}>
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
      <ResizeHandle onMouseDown={handleMouseDown} />
    </LabWindowWrapper>
  );
};

export default LabWindow;
