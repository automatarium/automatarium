import { CardContainer, CardImage, CardTitle, CardTitleAndText } from './tutorialCardStyle'
import { Logo } from '/src/components'

type CardProps = {
  title: string
  blurb: string
  image: string
  onClick: () => void
}

const TutorialCard = ({ title, blurb, image, ...props }: CardProps) => {
  // 4 modes: text only, image and text, image and title, title only
  const hasBlurb = blurb && blurb.length > 0
  const cardClass = image
    ? hasBlurb ? 'img-text' : 'img-only'
    : hasBlurb ? 'text-only' : 'title-only'
  return <CardContainer $cardClass={cardClass} {...props}>
    <CardImage $cardClass={cardClass}>{image ? <img src={image} alt={title} /> : <Logo size='8rem' />}</CardImage>
    <CardTitleAndText $cardClass={cardClass}>
      <CardTitle>{title}</CardTitle>
      {hasBlurb && <p>{blurb}</p>}
    </CardTitleAndText>
  </CardContainer>
}

export default TutorialCard
