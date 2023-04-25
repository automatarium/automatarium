import { Link } from 'react-router-dom'

import { Wrapper } from './buttonStyle'
import React, { ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  icon?: JSX.Element
  surface?: boolean
  secondary?: boolean
}

const Button = ({
  type = 'button',
  children,
  icon,
  secondary,
  surface,
  ...props
}: ButtonProps) => (
  <Wrapper
    type={type}
    $icon={icon && !children}
    $secondary={secondary}
    $surface={surface}
    as={'href' in props ? 'a' : ('to' in props ? Link : 'button')}
    {...props}
  >
    {icon}
    {children}
  </Wrapper>
)

export default Button
