import { styled } from 'goober'

export const ContentContainer = styled('div')`
  bottom: 1rem;
  left: 5rem;
  padding: 1.2rem;
  background: #282828;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  font-size: 12px;
  font-weight: bold;
  position: fixed;
`

export const StackContainer = styled('div')`
  padding: 0.5rem;
`

export const StackItem = styled('div')`
  font-weight: bold;
  font-size: 18px;
  width: 4.5rem;
  height: 2rem;
  margin: 0 auto;
  padding-top: 0.5rem;
  background-color: rgb(255, 255, 255);
  color: black;
  border-radius: 7px;
  border: solid 2px black;
  text-align: center;  /* centering text */
  display: flex;       /* centering text vertically */
  align-items: center; /* centering text vertically */
  justify-content: center; /* centering text horizontally */
`

export const CloseStackButton = styled('button')`
  border-radius: 5px;
  box-shadow: none;
  background-color: rgb(119, 119, 119);
  border: none;
  color: white;
  text-decoration: none;
  display: inline-block;
  font-size: 18px;
  padding: 0.2rem 0.7rem;
  cursor: pointer;
`
