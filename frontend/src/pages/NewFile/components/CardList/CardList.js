import { CardListContainer, CardListTitleContainer, CardList } from './cardListStyle'

const CardList = ({ title, children, button=null }) => <>
  <CardListTitleContainer>
    {title && <CardListTitle>{title}</CardListTitle>}
    {button}
  </CardListTitleContainer>
  <CardListContainer>
    {children}
  </CardListContainer>
</>


export default CardList
