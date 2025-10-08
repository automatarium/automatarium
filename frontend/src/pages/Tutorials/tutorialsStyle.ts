import { styled } from 'goober'

export const TitleRow = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 1em;
`

export const Title = styled('h2')`
  margin-block: 0;
`
export const ExampleContainer = styled('div')`
  display: flex;
  justify-content: center;
`

export const OfflineWarning = styled('div')`
  max-width: 100%;
  padding: 14px 20px;
  background-color: var(--error);
  color: white;
  text-align: center;
  margin: 20px 0;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  line-height: 1.4;
`
