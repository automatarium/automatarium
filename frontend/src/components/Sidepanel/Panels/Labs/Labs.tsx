import { SectionLabel, Preference, Switch, Button, Input } from '/src/components'
import { useState } from 'react'
import { useLabStore, useProjectStore } from '/src/stores'
import {createNewLab, createNewLabProject, LabProject, StoredLab} from 'src/stores/useLabStore'
import {  } from '/src/stores'
import { Wrapper, RemoveButton , EditButton, TextArea, AddQuestionButton, Table, TitleSection, ButtonContainer, Select, EditQuestionContainer, OptionButton, OptionInput } from './labsStyle'

const Labs = () => {
  const { lab, showLabWindow, setShowLabWindow, upsertProject } = useLabStore()
  const setProject = useProjectStore(s => s.set)
 
  
// Part 1 . Current assessment part const
  const [titleInput, setTitleInput] = useState('Sample Assessment Title');
  const [titleDescription, setTitleDescription] = useState('This is description of Assessment');
  const [isTitleEditing, setTitleIsEditing] = useState(false); // Single state for editing mode


// Part 1 . Current assessment part func 
  // Title 
    // Handle input change for the title
    const handleTitleInput = (event) => {  // title input 
      setTitleInput(event.target.value);
    };
    const handleDescriptionInput = (event) => {   // input save
      setTitleDescription(event.target.value);
    }; 
    const handleEditSaveClick = () => {  // switch the edit / read mode of title
      if (isTitleEditing) {
        setTitleIsEditing(false);
      } else {
        setTitleIsEditing(true);
      }
    };




  const [questions, setQuestions] = useState([
    "Question 1 content", "question 2 content", ""
  ]);



  const handleAddQuestion = () => {
    // Create lab project for new question
    const newLabProject = createNewLabProject("FSA", lab.meta.name);

    // Insert in current lab's list of project
    upsertProject(newLabProject)

    // Set the project for the editor
    setProject(newLabProject)
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
                rows={1} placeholder="Lab Title" 
              />
            </TitleSection>
            <TextArea 
              value={titleDescription} 
              onChange={(e) => setTitleDescription(e.target.value)} 
              rows={4} placeholder="Description" 
              />
            <ButtonContainer>
              <Button onClick={() => setTitleIsEditing(false)}>Cancel</Button> 
              <Button onClick={handleEditSaveClick}>Save</Button>
            </ButtonContainer>
            
          </>
        ) : (
          <>
            <TitleSection>
              <h2>{titleInput}</h2>
            </TitleSection>
            <p>{titleDescription}</p>
            <Button onClick={handleEditSaveClick}>Edit</Button>
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
            {lab.projects.map((q) => (
              <tr>
                <td>{q.meta.name}</td>
                <td>
                  <EditButton onClick={() => console.log("Edit button clicked")}>Edit</EditButton>
                  <RemoveButton onClick={() => console.log("Remove button clicked")}>Remove</RemoveButton>
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