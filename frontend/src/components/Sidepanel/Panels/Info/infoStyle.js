import { styled } from 'goober'

export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: .8rem;
  margin: .8rem;
`

export const Symbol = styled('div')`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 2em;
  aspect-ratio: 1 / 1;
  background: var(--toolbar);
  border-radius: .2rem;
  box-sizing: border-box;
  font-size: 1.1rem;
`

export const SymbolList = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: .4em;
`

export const Table = styled('table')`
  border-spacing: 0;
  --table-radius: .3rem;
  --table-border-color: var(--input-border);

  tr {
    &:first-of-type > th, &:first-of-type > td {
      border-top: 1px solid var(--table-border-color);

      &:nth-child(1) {
        border-top-left-radius: var(--table-radius);
      }

      &:nth-last-child(1) {
        border-top-right-radius: var(--table-radius);
      }
    }

    &:last-of-type > th, &:last-of-type > td {
      &:nth-child(1) {
        border-bottom-left-radius: var(--table-radius);
      }

      &:nth-last-child(1) {
        border-bottom-right-radius: var(--table-radius);
      }
    }
  }

  th, td {
    border-bottom: 1px solid var(--table-border-color);
    border-left: 1px solid var(--table-border-color);
    padding: .5em;

    &:nth-last-child(1) {
      border-right: 1px solid var(--table-border-color);
    }
  }

   th {
    background: var(--toolbar);
    font-weight: 400;
    border-color: white;
   }

   td {
    font-family: monospace;
    text-align: center;
   }
`
