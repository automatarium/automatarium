import { styled } from 'goober'
import { forwardRef } from 'react'

export const ModuleWindowWrapper = styled('div', forwardRef)<{ width: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${(props) => props.width};
  background-color: var(--surface);
  border-right: 1px solid var(--surface);
  color: var(--white);
  position: relative;
  overflow-y: auto;
  overflow: visible; 
  padding: 0 1em 1em;
`

export const ResizeHandle = styled('div')`
  height: 100%;
  background-color: rgb(165, 165, 165);
  width: 2px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: ew-resize;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  transition: background-color 0.2s ease-out, width 0.2s ease-out;

  &:hover {
    width: 3px;
    background-color: rgb(93, 159, 235);
  }
`

export const CloseButton = styled('button')`
  position: absolute;
  top: .6em;
  right: -1em;
  height: 2em;
  width: 2em;
  background: var(--toolbar);
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .3em;
  cursor: pointer;
`

export const TitleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export const Title = styled('h2')`
  font-size: 1.2em;
  font-weight: 600;
  margin: 0;
`

export const Content = styled('div')`
  margin-top: 10px;
  flex: 1;
  overflow-y: auto;
`

export const ButtonContainer = styled('div')`
  display: flex;
  gap: 0.5em;
  margin-left: auto;
`

export const EditButton = styled('div')`
  display: flex;
  gap: 0.5em;
`

export const TextArea = styled('textarea')`
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.3rem;
  margin-top: 0.5rem;
  margin-bottom: 0.8rem;
  background-color: var(--toolbar);
  color: white;
  resize: none;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`

export const PaginationWrapper = styled('div')`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 0.5rem;
`

export const SelectBox = styled('select')`
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

export const QuestionBlock = styled('div')`
  background-color: var(--toolbar);
  padding: 0.8rem;
  border-radius: 0.4rem;
  margin-bottom: 1rem;
`

export const QuestionHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;

  strong {
    font-size: 1rem;
    margin-right: auto; /* push title left */
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }
`
