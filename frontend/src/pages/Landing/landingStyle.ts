import { styled } from 'goober'

export const Sections = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6em;
  margin-block-start: 3em;

  @media (max-width: 600px) {
    gap: 3em;
  }
`

export const Section = styled('section')<{$reverse?: boolean}>`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1.2fr;
  grid-template-areas: "img text";
  gap: 2em;
  max-width: 800px;
  min-height: 5em;
  padding-inline: 2em;
  box-sizing: border-box;

  ${p => p.$reverse && `
    grid-template-areas: "text img";
    grid-template-columns: 1.2fr 1fr;
  `}

  .text {
    grid-area: text;
  }

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
`

export const Banner = styled('section')`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2em;
  box-sizing: border-box;
  background: hsl(var(--primary-h) var(--primary-s) var(--primary-l) / 25%);

  h2, h3 {
    margin: 0;
  }
`
