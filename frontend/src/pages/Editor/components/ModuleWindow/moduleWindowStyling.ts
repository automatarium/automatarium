import { styled } from 'goober'


export const ModuleWindowWrapper = styled<'div', { width: string }>('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--background);
  border-left: 1px solid var(--border);
  position: relative;
  width: ${(props) => props.width};
`

export const TitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
`

export const ModuleWindowTitle = styled('h2')`
  margin: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
`

export const Content = styled('div')`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`

export const TextArea = styled('textarea')`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  resize: none;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--text);
  background: var(--background);
`

export const ButtonContainer = styled('div')`
  display: flex;
  gap: 0.5rem;
`

export const EditButton = styled('div')`
  display: flex;
  gap: 0.5rem;
`

export const PaginationWrapper = styled('div')`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-top: 1px solid var(--border);
`

export const CloseButton = styled('button')`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
`

export const ResizeHandle = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
`
