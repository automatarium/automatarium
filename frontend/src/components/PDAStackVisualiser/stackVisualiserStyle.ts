import { styled } from 'goober'

export const ContentContainer = styled('div')`
  display: flex;         
  flex-direction: column; 
  align-items: center;   
  justify-content: flex-start; 
  bottom: 1rem;
  left: 5rem;
  padding: 1.2rem;
  background: #282828;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  position: fixed;
`

export const StackContainer = styled('div')`
  padding: 0.2rem;
`

export const StackItem = styled('div')`
  font-weight: bold;
  font-size: 18px;
  width: 4.5rem;
  height: 1.8rem;
  margin-top: 0.2rem;
  padding-top: 0.5rem;
  background-color: rgb(255, 255, 255);
  color: black;
  border-radius: 7px;
  border: solid 2px black;
  text-align: center;  
  display: flex;       
  align-items: center; 
  justify-content: center; 
`

export const ToggleStackButton = styled('button')`
  position: absolute;
  top: -.4em;
  z-index: 15;
  right: -0.6em;
  height: 2em;
  width: 2em;
  font-size: 1.2em;
  background: var(--toolbar);
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .3em;
  cursor: pointer;
`

export const Label = styled('label')`
  text-transform: uppercase;
  font-size: 1.00em;
  font-weight: 600;
  letter-spacing: .1em;
  color: var(--input-border);
  display: block;
  padding: .6em .6rem;
`
