import { CardListContainer, CardListTitleContainer, CardListTitle } from './cardListStyle'
import { HTMLAttributes, ReactNode } from 'react'

interface CardListProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  button?: ReactNode
}

const CardList = ({ title, button, ...props }: CardListProps) => (
  <section>
    <CardListTitleContainer>
      {title && <CardListTitle>{title}</CardListTitle>}
      {button}
    </CardListTitleContainer>
    <CardListContainer {...props} />
  </section>
)

export default CardList
