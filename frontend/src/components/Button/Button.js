import { Wrapper } from './buttonStyle'

const Button = ({
  type = 'button',
  children,
  icon,
  secondary,
  surface,
  ...props
}) => (
  <Wrapper
    type={type}
    $icon={icon && !children}
    $secondary={secondary}
    $surface={surface}
    {...props}
  >
    {icon}
    {children}
  </Wrapper>
)

export default Button
