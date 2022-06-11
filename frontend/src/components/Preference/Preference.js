import { Wrapper, Description } from './preferenceStyle'

const Preference = ({ label, description, children, htmlFor, ...props }) => (
  <Wrapper {...props}>
    <div>
      <label htmlFor={htmlFor}>{label}</label>
      {description && <Description htmlFor={htmlFor}>{description}</Description>}
    </div>
    {children}
  </Wrapper>
)

export default Preference
