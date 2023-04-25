import { Wrapper, Description } from './preferenceStyle'
import { HTMLAttributes } from 'react'

interface PreferenceProps extends HTMLAttributes<HTMLLabelElement> {
  label: string
  description?: string
  fullWidth?: boolean
}

const Preference = ({ label, description, children, fullWidth, ...props }: PreferenceProps) => (
  <Wrapper $fullWidth={fullWidth} {...props}>
    <div>
      <span>{label}</span>
      {description && <Description>{description}</Description>}
    </div>
    {children}
  </Wrapper>
)

export default Preference
