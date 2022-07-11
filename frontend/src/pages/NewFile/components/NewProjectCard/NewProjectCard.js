import { CardContainer, CardImage, CardContent } from './newProjectCardStyle'

const NewProjectCard = ({ title, description, image, ...props }) => {
  return (
    <CardContainer {...props}>
      <CardImage $disabled={props.disabled}>{image}</CardImage>
      <CardContent>
        <strong>{title}</strong>
        <p>{description}</p>
      </CardContent>
    </CardContainer>
  )
}

export default NewProjectCard
