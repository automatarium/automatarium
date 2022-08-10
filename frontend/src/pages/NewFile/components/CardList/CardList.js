import { CardListContainer, CardListTitleContainer, CardListTitle } from './cardListStyle'

const CardList = ({ title, button, ...props }) => (
  <section>
    <CardListTitleContainer>
      {title && <CardListTitle>{title}</CardListTitle>}
      {button}
    </CardListTitleContainer>
    <CardListContainer {...props} />
  </section>
)

export default CardList
