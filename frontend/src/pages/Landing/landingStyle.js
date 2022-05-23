import { styled } from 'goober'

export const Sections = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6em;
  margin-block-start: 3em;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: .5rem;
    max-height: 14em;
  }

  a {
    text-decoration: none;
  }
`

export const ColumnsSection = styled('section')`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "img text";
  gap: 2em;
  max-width: 800px;
  min-height: 12em;

  ${p => p.$reverse && `
    grid-template-areas: "text img"; 
  `}

  img {
    grid-area: img;
  }
  div {
    grid-area: text;
  }
`

export const BannerSection = styled('section')`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-block: 2em;
  background: hsl(var(--primary-h) var(--primary-s) var(--primary-l) / 25%);

  h2, h3 {
    margin: 0;
  }
`
