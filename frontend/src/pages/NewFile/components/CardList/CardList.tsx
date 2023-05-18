import { CardListContainer, CardListTitleContainer, CardListTitle } from './cardListStyle'
import { HTMLAttributes, ReactNode, Ref } from 'react'

interface CardListProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  button?: ReactNode
  innerRef?: Ref<HTMLDivElement>
}

const CardList = ({ title, button, innerRef, ...props }: CardListProps) => (
  <section>
    <CardListTitleContainer>
      {title && <CardListTitle>{title}</CardListTitle>}
      {button}
    </CardListTitleContainer>
    <CardListContainer ref={innerRef} {...props} />
  </section>
)

export default CardList
