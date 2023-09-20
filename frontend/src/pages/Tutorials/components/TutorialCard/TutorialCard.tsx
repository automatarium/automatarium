import { CardContainer, CardImage, CardTitle, CardTitleAndText } from './tutorialCardStyle'

type CardProps = {
  title: string
  description: string
  image: string
  onClick: () => void
}

const TutorialCard = ({ title, description, image, ...props }: CardProps) => {
  // 4 modes: text only, image and text, image and title, title only
  const hasDescription = description && description.length > 0
  const cardClass = image
    ? hasDescription ? 'img-text' : 'img-only'
    : hasDescription ? 'text-only' : 'title-only'
  return <CardContainer $cardClass={cardClass} {...props}>
    {image && <CardImage $cardClass={cardClass}><img src={image} alt={title} /></CardImage>}
    <CardTitleAndText $cardClass={cardClass}>
      <CardTitle>{title}</CardTitle>
      {hasDescription && <p>{description}</p>}
    </CardTitleAndText>
  </CardContainer>
}

export default TutorialCard
