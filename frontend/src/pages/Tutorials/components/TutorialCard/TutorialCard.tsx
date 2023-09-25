import { CardContainer, CardImage, CardTitle, CardTitleAndText } from './tutorialCardStyle'

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
    {image && <CardImage $cardClass={cardClass}><img src={image} alt={title} /></CardImage>}
    <CardTitleAndText $cardClass={cardClass}>
      <CardTitle>{title}</CardTitle>
      {hasBlurb && <p dangerouslySetInnerHTML={{ __html: blurb }}></p>}
    </CardTitleAndText>
  </CardContainer>
}

export default TutorialCard
