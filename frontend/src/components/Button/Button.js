import { Wrapper } from './buttonStyle'

const Button = ({
  type = 'button',
  children,
  icon,
  secondary,
  border,
  ...props
}) => (
  <Wrapper
    type={type}
    $icon={icon && !children}
    $secondary={secondary}
    $border={border}
    {...props}
  >
    {icon}
    {children}
  </Wrapper>
)

export default Button
