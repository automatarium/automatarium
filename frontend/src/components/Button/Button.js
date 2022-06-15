import { Link } from 'react-router-dom'

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
    as={props.href ? 'a' : (props.to ? Link : 'button')}
    {...props}
  >
    {icon}
    {children}
  </Wrapper>
)

export default Button
