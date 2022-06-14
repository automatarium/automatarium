import { Wrapper, Description } from './preferenceStyle'

const Preference = ({ label, description, children, fullWidth, ...props }) => (
  <Wrapper $fullWidth={fullWidth} {...props}>
    <div>
      <span>{label}</span>
      {description && <Description>{description}</Description>}
    </div>
    {children}
  </Wrapper>
)

export default Preference
