import { styled } from 'goober'
import { TourContentProps } from './ProjectTour'

export const ButtonContainer = styled('div')`
  display: flex;
  justify-content: right; 
  gap: 1em; 
  padding: 1em;
`

export const TourOverlay = styled('div')`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const TourContent = styled('div')<TourContentProps>`
    pointer-events: auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    max-width: 50%;
    max-height: 80%;
    overflow: auto;
    background-color: var(--surface);
    outline: 1px solid var(--input-border);
    box-shadow: 0 2px 5px rgba(0 0 0 / .5);
`