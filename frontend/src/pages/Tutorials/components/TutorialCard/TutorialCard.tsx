import { CardContainer, CardTitle } from './tutorialCardStyle'

export const TutorialCard = ({ title, description, ...props }) => {
  return <CardContainer {...props}>
    <CardTitle>{title}</CardTitle>
    <p>{description}</p>
  </CardContainer>
}
