import { CardListContainer, CardListTitleContainer, CardListTitle } from './cardListStyle'

const CardList = ({ title, children, scroll=false, button=null }) => <>
  <CardListTitleContainer>
    {title && <CardListTitle>{title}</CardListTitle>}
    {button}
  </CardListTitleContainer>
  <CardListContainer $scroll={scroll}>
    {children}
  </CardListContainer>
</>

export default CardList
