import { SectionLabel, Preference, Switch, Button, Input } from '/src/components'
import { useState } from 'react'
import { useLabStore } from '/src/stores'
import { useProjectStore } from '/src/stores'
import { Wrapper, RemoveButton , EditButton, TextArea, AddQuestionButton, Table, TitleSection, ButtonContainer, Select, EditQuestionContainer, OptionButton, OptionInput } from './labsStyle'

const Labs = () => {
  const { lab, showLabWindow, setShowLabWindow } = useLabStore()
 
  
// Part 1 . Current assessment part const
  // ❔ note sure what this < useState > for , seems there are  <useProjectStore>  and  <useTemplatesStore> .etc
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



// part 2 question table const

  const [questions, setQuestions] = useState([
    { id: 1, title: "questionName1", type: "MCQ", options: ["Option 1", "Option 2"], singleSelection: true },
    { id: 2, title: "questionName2", type: "TEXT", options: [], singleSelection: false }
  ]);

  const [newQuestion, setNewQuestion] = useState({
    id: null,
    title: "",
    type: "Text",
    options: [],
    singleSelection: false 
  });

  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  const handleRemoveQuestionClick = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleEditQuestionClick = (question) => {
    setNewQuestion({ ...question });
    setIsEditingQuestion(true);
  };
  

  const handleAddQuestion = () => {
    if (newQuestion.title && newQuestion.type) {
      setQuestions([
        ...questions,
        { id: questions.length + 1, ...newQuestion }
      ]);
      setNewQuestion({ id: null, title: "", type: "Text", options: [], singleSelection: false });
    } else {
      // Handle validation error
      alert("Please fill out the title and type.");
    }
  };
  

  const handdleEditQuestionClick =(question) =>{
    setNewQuestion({...question});
    setIsEditingQuestion(true);} 



  const handleSaveEditQuestionClick = () => {
    if (newQuestion.title && newQuestion.type) {
      setQuestions(
        questions.map(q => q.id === newQuestion.id ? newQuestion : q)
      );
      setNewQuestion({ id: null, title: "", type: "Text", options: [], singleSelection: false });
      setIsEditingQuestion(false);
    } else {
      // Handle validation error
      alert("Please fill out the title and type.");
    }
  };

  

  const handleTitleChange = (e) => setNewQuestion({ ...newQuestion, title: e.target.value });
  const handleTypeChange = (e) => setNewQuestion({ ...newQuestion, type: e.target.value });
  const handleOptionChange = (index, e) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = e.target.value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };
  const handleAddOption = () => setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] });

  
  // //update
  // const updateQuestion = (id, updateQuestion )=>{
  //   setQuestions(
  //     // for each question q
  //     questions.map(q =>
  //       // if id matches 
  //       q.id === id? {...q, updateQuestion, isEditing: false }:q
  //     )
  //   );
  // }




  if (showLabWindow) {
    console.log("Opened lab window")
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
              <Button onClick={handleEditSaveClick}>Save</Button>
              <Button onClick={() => setTitleIsEditing(false)}>Cancel</Button> 
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
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.title}</td>
                <td>{q.type}</td>
                <td>
                  <EditButton onClick={() => handleEditQuestionClick(q)}>Edit</EditButton>
                  <RemoveButton onClick={() => handleRemoveQuestionClick(q.id)}>Remove</RemoveButton>
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

//   return (<>
//     <SectionLabel>Current Assessment</SectionLabel>
//         {!lab && <>
//         <Wrapper>You're not working on a lab right now</Wrapper>
//         </>}
//     {lab && <>

//     {/* set title and description*/}
//     <Wrapper> 
//     {isTitleEditing? ( // default false
//       <>  
//         <input   // enter the title of assessment 
//           type="text"
//           value={titleInput}
//           onChange={handleTitleInput}
//           placeholder="Assessment Title "
//         />
//         <br />
//         <textarea
//             value={titleDescription}
//             onChange={handleDescriptionInput}
//             placeholder="Enter description"
//             rows={4}
//             cols={50}
//           ></textarea>
//         <Button onClick={handleEditSaveClick}>Save</Button>
//       </>
//     ):(   
//       <>
//         <span>{titleInput}</span>
//         <br />
//         <p>{titleDescription}</p>
//         <button onClick={handleEditSaveClick}>Edit</button>
//       </>
//     )}
//     </Wrapper>


//     <SectionLabel>Lab Setting</SectionLabel>
//     <Wrapper>
//       <Preference
//         label={'Open questions to the left'}
//         style={{ marginBlock: 0 }}
//       >
//         <Switch
//           type="checkbox"
//           checked={showLabWindow}
//           onChange={e => setShowLabWindow(e.target.checked)}
//         />
//       </Preference>
//     </Wrapper>
//     <SectionLabel>Questions</SectionLabel>


//     <Wrapper>
//       <div>
//         <table>
//         <thead>
//             <tr>
//               <th>Question</th>
//               <th>Type</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {questions.map((q) => (
//               <tr key={q.id}>
//                 <td>{q.title}</td>
//                 <td>{q.type}</td>
//                 <td> <button onClick={() => handleEditQuestionClick(q)}>Edit</button>
//                     <button onClick={() => handleRemoveQuestionClick(q.id)}>Remove</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <br />
//         <button onClick={() =>setIsEditingQuestion(true)}>+ Add Question</button>

//         {isEditingQuestion &&(  // on editing 
//         // title & question pattern < text default 
//           <div>
//             <input 
//               type="text" 
//               value={newQuestion.title}
//             onChange={handleTitleChange}  
//               placeholder="Question Title"
//             /> 
         
//             {/* dropdown table of pattern  */}
//             <select 
//               value={newQuestion.type} 
//               onChange={handleTypeChange}
//             >
//               <option value="Text">Text</option>
//               <option value="MCQ">MCQ</option>
//               <option value="FSM">FSM</option>
//             </select>
//             <br />
//             {newQuestion.type === "MCQ" && (
//               <div>
//                 {newQuestion.options.map((option, index) => (
//                   <div key={index}>
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) => handleOptionChange(index, e)}
//                     />
//                     <button 
//                       onClick={() => handleRemoveOption(index)}
//                     >Remove</button>
//                   </div>
//                 ))}
//                 <button 
//                   onClick={handleAddOption}
//                 >Add Option</button>
//               </div>
//             )}
//             <br />
//             <button onClick={handleSaveEditQuestionClick}>
//               {newQuestion.id ? "Save Question" : "Add Question"}
//             </button>
//           </div>
//         )}
//       </div>




// {/* display the current question table */}
//         {/* <table>  
//           <thead>
//             <tr>
//               <th>
//                 Question
//               </th>
//               <th>
//                 Type
//               </th>
//               <th>
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {questions.map((q)=>(  //display of questions 
//               <tr key={q.id}>
//                 <td>{q.title}</td>  
//                 <td>{q.type}</td>
//                 <td>
//                   <button onClick={() => startEditQuestion(q)}>Edit</button>
//                   <button onClick={() => removeQuestion(q.id)}>Remove</button>
//                 </td> 
//               </tr>
//             ))}
//           </tbody>
//         </table>   */}


//             {/* add new questions  */}


//             {/* <div>
//               <input //enter the title of questions 
//                 type="text" 
//                 placeholder='New question title'
//                 value={newQuestion.title}  
//                 onChange={(e) => setNewQuestion({...newQuestion,title:e.target.value})}
//               />

//               <select // select type of edit  
//                 value={newQuestion.type} 
//                 onChange={(e) => setNewQuestion({...newQuestion,type:e.target.value})}>
//                 {questionTypes.map((type) =>(  //  dropdown table 
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//               <button onClick={addQuestion}>+ Add Question</button>
//             </div> */}


         
        



//     </Wrapper>
//     <SectionLabel>Export</SectionLabel>
//     <Wrapper>
//     <Button 
//       onClick={() => {console.log("Button Click")}}>
//         Export as Automatrium lab file
//     </Button>
//     <Button 
//       onClick={() => {console.log("Button Click")}}>
//         Export as URL
//     </Button>
//     </Wrapper>
//     </>
//     }
//   </>
//   )
// }

export default Labs