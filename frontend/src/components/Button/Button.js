import { Wrapper } from './buttonStyle'

const Button = ({
  type = 'button',
  children,
  icon,
  secondary,
  ...props
}) => (
  <Wrapper
    type={type}
    $icon={icon && !children}
    $secondary={secondary}
    {...props}
  >
    {icon}
    {children}
  </Wrapper>
)

export default Button
