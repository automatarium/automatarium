import { CardContainer, CardImage, CardTitle, CardTitleAndText } from './tutorialCardStyle'

const TutorialCard = ({ title, description, image, ...props }) => {
  return <CardContainer {...props}>
    {image && <CardImage><img src={image} alt={title} /></CardImage>}
    <CardTitleAndText>
      <CardTitle>{title}</CardTitle>
      <p>{description}</p>
    </CardTitleAndText>
  </CardContainer>
}

export default TutorialCard
