import { CardContainer, CardImage, CardContent } from './newProjectCardStyle'

const NewProjectCard = ({ title, description, disabled, ...props }) => {
  return <CardContainer $disabled={disabled} {...props}>
    <CardImage $disabled={disabled}/>
    <CardContent>
      <strong>{title}</strong>
      <p>{description}</p>
    </CardContent>
  </CardContainer>
}

export default NewProjectCard
