import { styled } from 'goober'

export const CardContainer = styled('div')`
  display: grid;
  grid-template-rows: 1.3fr 1fr;
  box-sizing: border-box;
  min-width: 15em;
  width: 20em;

  border-radius: .5rem;
  border: 3px solid transparent;
  overflow: hidden;

  ${p => !p.$disabled && `
    cursor: pointer;
    &:hover {
      border: 3px solid var(--primary);
    }
  `}

  ${p => p.$disabled && `
    opacity: .7; 
  `}
`

export const CardContent = styled('div')`
  background: var(--toolbar);
  padding: .9em;

  > p { 
    margin: 0;
    margin-top: .5em;
    font-size: .9rem;
  }
`

export const CardImage = styled('div')`
  /* TODO: use image in place of temp background */
  --dot-fraction: 12.5%;
  background: radial-gradient(
    var(--grid-dot),
    var(--grid-dot) var(--dot-fraction),
    var(--white) var(--dot-fraction));
  background-size: 30px 30px;
  background-position: 5px 5px;

  ${p => p.$disabled && `
    position: relative;
    &::after {
      content: 'Coming Soon';
      display: flex;
      align-items: center;
      justify-content: center;
      color: grey;
      font-size: 1.7rem;
      opacity: .4;
      position: absolute;
      inset: 0;
      font-family: var(--font-feature);
    } 
  `}
`
