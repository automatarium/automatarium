import { styled } from 'goober'

const CardList = ({ title, children, button=null }) => <>
  <CardListTitleContainer>
    {title && <CardListTitle>{title}</CardListTitle>}
    {button}
  </CardListTitleContainer>
  <CardListContainer>
    {children}
  </CardListContainer>
</>

const CardListTitleContainer = styled('div')`
  display: flex;
  width: 100%;
  gap: 1em;
  align-items: center;
`

const CardListTitle = styled('h2')`
  margin-block: 0;
`

const CardListContainer = styled('div')`
  display: flex;
  gap: .4em;
  margin-block-start: 1em;
  margin-block-end: 3em;
`

export default CardList
