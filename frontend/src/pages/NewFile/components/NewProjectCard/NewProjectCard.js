import { CardContainer, CardImage, CardContent } from './newProjectCardStyle'
import { usePreferencesStore } from '/src/stores'

const NewProjectCard = ({ title, description, image, ...props }) => {
  const preferences = usePreferencesStore(state => state.preferences)
  return (
    <CardContainer {...props}>
      <CardImage $disabled={props.disabled} theme={preferences.theme}>{image}</CardImage>
      <CardContent>
        <strong>{title}</strong>
        <p>{description}</p>
      </CardContent>
    </CardContainer>
  )
}

export default NewProjectCard
