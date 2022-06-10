import { CardContainer, CardImage, CardContent } from './newProjectCardStyle'

const NewProjectCard = ({ title, description, ...props }) => {
  return (
    <CardContainer {...props}>
      <CardImage $disabled={props.disabled}/>
      <CardContent>
        <strong>{title}</strong>
        <p>{description}</p>
      </CardContent>
    </CardContainer>
  )
}

export default NewProjectCard
