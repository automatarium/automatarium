import { styled } from 'goober';

export const ModuleWindowWrapper = styled('div')<{ width: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${(props) => props.width}; /* Dynamic width */
  padding: 16px;
  background-color: var(--surface);
  border-right: 1px solid var(--surface);
  height: 86vh;
  overflow-y: auto;
  color: var(--white);
  position: relative; /* To position the resize handle */
  overflow-y: auto;
  overflow: visible;
`;

export const ResizeHandle = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 5px;
  cursor: ew-resize;
  background-color: var(--surface); /* For visibility */
`;

export const CloseButton = styled('button')`
  position: absolute;
  top: 17px;
  right: -14px; /* Half outside the panel (adjust as needed) */
  padding: 0.2em 0.5rem;
  background-color: var(--toolbar);
  color: var(--white);
  border: none;
  border-radius: 0.3em;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add a slight shadow for emphasis */
  z-index: 10; /* Ensure it's above other elements */

  
`;

export const TitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--surface);
  padding-bottom: 8px;
`;

export const Title = styled('h2')`
  margin: 0;
  color: var(--white); /* Title color */
`;

export const EditButton = styled('button')<{$active?: boolean}>`
  background-color: var(--primary);
  margin-right: 10px;
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

export const Content = styled('div')`
  margin-top: 30px;
`;

export const Textarea = styled('textarea')`
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

export const PaginationWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: auto; /* Ensures pagination sticks to the bottom */
  padding-top: 16px;
`;

export const PaginationButton = styled('button')`
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
`;