import { CardContainer, CardImage, CardTitle } from './tutorialCardStyle'

const TutorialCard = ({ title, description, image, ...props }) => {
  return <CardContainer {...props}>
    <CardImage>{image && <img src={image} alt={title} />}</CardImage>
    <CardTitle>{title}</CardTitle>
    <p>{description}</p>
  </CardContainer>
}

export default TutorialCard
