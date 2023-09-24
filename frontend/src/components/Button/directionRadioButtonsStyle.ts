import { styled } from 'goober'

export const DirectionRadioGroup = styled('div')`
  display: flex;
  gap: 0.5em;
  padding-top: 0.5em;
  padding-bottom: 0.3em;
  padding-left: 0.4em;
`

export const DirectionLabel = styled('label')`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-transform: uppercase;
  font-size: .85em;
  font-weight: 600;
  color: var(--input-border);
`

export const DirectionRadioInput = styled('input')`
  width: 1.5em;
  height: 1.5em;
  appearance: none;
  outline: none;
  border: 2px solid white; 
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  padding-right: 0.2em;

  &:checked:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    background-color: var(--primary);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`
