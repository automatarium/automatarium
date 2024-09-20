import { styled } from 'goober';


// Wrapper for the Lab section 
export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0.5rem;
`;

export const TitleSection = styled('div')`
  margin-bottom: 0.1rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--toolbar); 
  h2 {
    margin: 0; /* Remove margin from h2 */
    font-size: 1.5rem; 
    padding-bottom: 0.5rem;
  }
`;

// Button container for question actions (add, edit, remove)
export const QuestionRow = styled('tr')`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr; /* Set grid for Question, Type, Actions */
  align-items: center;
  padding: 0.8rem 0;

  & td {
    padding: 0.5rem;
    text-align: left; 
  }

  & td:last-child {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
`;

// Button for editing questions
export const EditButton = styled('button')`
  background-color: var(--primary);
  color: white;
  border: 1px solid transparent;
  border-radius: 0.3rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

`;

// Button for removing questions
export const RemoveButton = styled('button')`
  background-color: var(--error);
  color: white;
  border: 1px solid transparent;
  border-radius: 0.3rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  // &:hover {
  //   background-color: var(--toolbar); 
  //   border-color: var(--error); 
  // }
`;

// Styles for the Add Question button
export const AddQuestionButton = styled('button')`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0.3rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  transition: background-color 0.3s;
  width: 100%;

`;

// Table header styles 
export const TableHeader = styled('thead')`
  background-color: var(--toolbar);
  color: white;

  & th {
    text-align: left;
    padding: 0.5rem;
  }
`;

// General Table styling for questions
export const Table = styled('table')`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.8rem;

  th, td {
    padding: 0.5rem;
    text-align: left;
  }

  th {
    background-color: var(--toolbar); 
    color: white;
    border-bottom: 1px solid var(--toolbar); 
  }

  tr {
    border-bottom: 1px solid var(--toolbar);
  }

  tr:last-child td {
    border-bottom: none; 
  }

  td:last-child {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-start; 
  }
`;


// Title and description input field styles
export const Input = styled('input')`
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid var(--border); 
  border-radius: 0.3rem;
  margin-bottom: 0.8rem;
  box-sizing: border-box;
  background-color: var(--toolbar) !important; 
  color: white; 
  
  &:focus {
    outline: none;
    border-color: var(--primary); 
  }

}
`;

export const TextArea = styled('textarea')`
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.3rem;
  margin-bottom: 0.8rem;
  box-sizing: border-box;
  background-color: var(--toolbar);
  color: white; 
  resize: none;

  &:focus {
    outline: none;
    border-color: var(--primary); 
  }
`;

// Export button styles (consistent with other buttons)
export const ExportButton = styled('button')`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0.3rem;
  padding: 0.6rem 1.2rem;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

// Styles for warnings (reused from testingLabStyles)
export const WarningLabel = styled('div')`
  display: flex;
  margin: 0.8rem;
  border-radius: 0.3rem;
  padding: 0.5em;
  gap: 0.5em;
  align-items: center;
  background: var(--error);
  color: white;
`;

// Switch label styling for lab settings
export const Preference = styled('label')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  font-size: 1rem;
  cursor: pointer;
`;

export const ButtonContainer = styled('div')`
  display: flex;
  justify-content: center; 
  gap: 0.5em; 
  width: 100%;

  Button {
    width: 100%;
  }

  Button:nth-child(1) {
    background-color: transparent;
    color: var(--primary-dark);
    border: 2.5px solid var(--toolbar); 

    &:hover {
      background-color: var(--toolbar);
      color: white;
    }
  }
`;

export const EditQuestionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Adds spacing between elements */
  margin-top: 1.5rem;
`;


export const Select = styled('select')`
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.3rem;
  background-color: var(--toolbar); /* Consistent dark background */
  color: white; /* White text */
`;

export const OptionInput = styled('input')`
  width: 100%;
  padding: 0.6rem 0;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.3rem;
  margin-bottom: 0.5rem;
  background-color: var(--toolbar); /* Same background */
  color: white; /* Consistent text color */
`;

export const OptionButton = styled('button')`
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border-radius: 0.3rem;
  background-color: var(--primary);
  color: white;
  cursor: pointer;

  &:hover {
    background-color: var(--primary-dark);
  }
`;