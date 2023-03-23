import { CardContainer, CardImage, CardContent } from './newProjectCardStyle'
import { usePreferencesStore } from '/src/stores'

const NewProjectCard = ({ title, description, image, ...props }) => {
  const preferences = usePreferencesStore(state => state.preferences)
  // If matching system theme, don't append a theme to css vars
  const theme = preferences.theme === 'system' ? '' : `-${preferences.theme}`
  return (
    <CardContainer {...props}>
      <CardImage $disabled={props.disabled} theme={theme}>{image}</CardImage>
      <CardContent>
        <strong>{title}</strong>
        <p>{description}</p>
      </CardContent>
    </CardContainer>
  )
}

export default NewProjectCard
