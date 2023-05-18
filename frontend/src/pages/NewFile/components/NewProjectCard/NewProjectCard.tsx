import { CardContainer, CardImage, CardContent } from './newProjectCardStyle'
import { usePreferencesStore } from '/src/stores'
import { ReactNode } from 'react'

interface NewProjectCardProps {
  title: string
  description: string
  image: ReactNode
  onClick: () => void
  height: number
  disabled?: boolean
}

const NewProjectCard = ({ title, description, image, height, ...props }: NewProjectCardProps) => {
  const preferences = usePreferencesStore(state => state.preferences)
  // If matching system theme, don't append a theme to css vars
  const theme = preferences.theme === 'system' ? '' : `-${preferences.theme}`
  return (
    <CardContainer height={height} {...props}>
      <CardImage $disabled={props.disabled} theme={theme}>{image}</CardImage>
      <CardContent>
        <strong>{title}</strong>
        <p>{description}</p>
      </CardContent>
    </CardContainer>
  )
}

export default NewProjectCard
