import { SectionLabel, Preference, Switch, Button, Input } from '/src/components'
import { useState, useEffect } from 'react'
import { useLabStore, useLabsStore, useProjectStore } from '/src/stores'
import { createNewLabProject, LabProject } from 'src/stores/useLabStore'
import { Wrapper, RemoveButton , EditButton, TextArea, AddQuestionButton, Table, TitleSection, ButtonContainer, Select, EditQuestionContainer, OptionButton, OptionInput } from './labsStyle'

const Labs = () => {
  const { lab, showLabWindow, setShowLabWindow, upsertProject, deleteProject, setName, setLabDescription } = useLabStore()
  const upsertLab = useLabsStore(s => s.upsertLab)
  const setProject = useProjectStore(s => s.set)
  const currentProject = useProjectStore(s => s.project)
 
  
  // Current assessment description and title
  const [isTitleEditing, setTitleIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [titleDescription, setTitleDescription] = useState('');

  // Load lab values into local state when lab changes
  useEffect(() => {
    if (lab) {
      setTitleInput(lab.meta.name || ''); // Populate title input
      setTitleDescription(lab.description || ''); // Populate description input
    }
  }, [lab]);

  // Open edit mode and reset the input fields
  const handleEditClick = () => {
    if (lab) {
      setTitleInput(lab.meta.name || ''); // Reset title input
      setTitleDescription(lab.description || ''); // Reset description input
    }
    setTitleIsEditing(true); // Enable edit mode
  };

  // Save the new title and description to the store
  const handleEditSaveClick = () => {
    setName(titleInput);
    setLabDescription(titleDescription);
    setTitleIsEditing(false); // Exit edit mode after saving
  };

  // Cancel editing and reset the input fields to the stored values
  const handleCancelClick = () => {
    if (lab) {
      setTitleInput(lab.meta.name || ''); // Reset title input
      setTitleDescription(lab.description || ''); // Reset description input
    }
    setTitleIsEditing(false); // Exit edit mode without saving
  };


  const saveLab = () => {
    const project = useProjectStore.getState().project
    upsertProject({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
    const lab = useLabStore.getState().lab
    upsertLab(lab)
  }



  // Table of questions
  const handleAddQuestion = () => {
    // Create lab project for new question
    const newLabProject = createNewLabProject("FSA", lab.meta.name);

    // Insert in current lab's list of project
    upsertProject(newLabProject)

    // Set the project for the editor
    setProject(newLabProject)
  }

  const handleEditQuestion = (_lab: LabProject) => {
    // TODO: Check if current project has unsaved changes and confirm with user

    // Save current changes before moving to another question
    saveLab()
    // Set the project for the editor
    setProject(_lab)
  }

  const handleDeleteQuestion = (_lab: LabProject) => {
    // Delete projects from lab
    deleteProject(_lab._id)
    if (_lab._id === currentProject._id) {
      const remainingProjects = lab.projects.filter((proj) => proj._id !== _lab._id);
      setProject(remainingProjects[0]); // Set the first remaining project as the current project
    }
  }
  
  return (
    <>
      <SectionLabel>Current Assessment</SectionLabel>
      {!lab && <>
        <Wrapper>You're not working on a lab right now</Wrapper>
         </>}
      {lab && <>
        <Wrapper>
      {isTitleEditing ? (
        <>
          <TitleSection>
            <TextArea 
              value={titleInput} 
              onChange={(e) => setTitleInput(e.target.value)} 
              rows={1} 
              placeholder="Lab Title" 
            />
          </TitleSection>
          <TextArea 
            value={titleDescription} 
            onChange={(e) => setTitleDescription(e.target.value)} 
            rows={4} 
            placeholder="Description" 
          />
          <ButtonContainer>
            <Button onClick={handleCancelClick}>Cancel</Button> 
            <Button onClick={handleEditSaveClick}>Save</Button>
          </ButtonContainer>
        </>
      ) : (
        <>
          <TitleSection>
            <h2>{lab?.meta.name || 'Lab Title'}</h2> {/* Display current lab title */}
          </TitleSection>
          <p>{lab?.description || 'Lab Description'}</p> {/* Display current lab description */}
          <Button onClick={handleEditClick}>Edit</Button> {/* Toggle edit mode */}
        </>
      )}
    </Wrapper>

      <SectionLabel>Lab Settings</SectionLabel>
      <Wrapper>
        <Preference label="Open questions to the left">
          <Switch type="checkbox" checked={showLabWindow} onChange={() => setShowLabWindow(!showLabWindow)}/>
        </Preference>
      </Wrapper>

      <>
      <SectionLabel>Questions</SectionLabel>
      <Wrapper>
        <Table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lab.projects.map((q, index) => (
              <tr 
              key={q._id}
              style={{
                backgroundColor: currentProject && currentProject._id === q._id ? 'var(--toolbar)' : 'transparent', // Highlight if it's the current project
              }}
              >
                <td>{`Question ${index + 1}`}</td>
                <td>
                  <EditButton onClick={() => handleEditQuestion(q)}>Open</EditButton>
                  <RemoveButton 
                    onClick={() => handleDeleteQuestion(q)}
                    disabled={lab.projects.length <= 1}
                  >
                    Remove
                  </RemoveButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <AddQuestionButton onClick={handleAddQuestion}>+ Add question</AddQuestionButton>

      </Wrapper>
    </>


      <SectionLabel>Export</SectionLabel>
      <Wrapper>
        <Button>Export as Automatrium lab file</Button>
        <Button>Export as URL</Button>
      </Wrapper>
    </>
  }
  </>
  );
};

export default Labs