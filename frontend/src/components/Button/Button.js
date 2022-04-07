import { Wrapper } from './buttonStyle'

const Button = ({
  type = 'button',
  children,
  icon,
  ...props
}) => (
  <Wrapper
    type={type}
    $icon={icon && !children}
    {...props}
  >
    {icon}
    {children}
  </Wrapper>
)

export default Button