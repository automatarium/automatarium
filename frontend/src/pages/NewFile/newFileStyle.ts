import { styled } from 'goober'

export const NoResultSpan = styled('span')`
  opacity: .5;
  font-style: italic;
`

export const HeaderRow = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1em;
  flex-wrap: wrap;

  header { margin-bottom: 0; }
`

export const ButtonGroup = styled('div')`
  display: flex;
  gap: .8em;
`

export const PreferencesButton = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  height: 2em;
  width: 2em;
`
// styling for creating new lab modal
export const ModalForm = styled('form')`
  display: flex;
  flex-direction: column;
  // adds space between fields
  gap: 1rem; 
`

export const FormLabel = styled('label')`
  display: flex;
  flex-direction: column;
  font-weight: bold;
`

export const FormInput = styled('input')`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`

export const FormSelect = styled('select')`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`

export const FormTextarea = styled('textarea')`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: none; 
  min-height: 100px;
  overflow-y: auto;
`
