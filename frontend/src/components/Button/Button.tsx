/* eslint-disable react/no-unknown-property */

import { Link, LinkProps, To } from 'react-router-dom'

import { ButtonStyleClass } from './buttonStyle'
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type BaseButtonProps = {
  children?: ReactNode
  icon?: JSX.Element
  surface?: boolean
  secondary?: boolean
}

type AnchorButtonProps = {
  href: string
} & BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>

type LinkButtonProps = {
  to: To
} & BaseButtonProps & LinkProps

type ButtonButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>

type ButtonProps = AnchorButtonProps | ButtonButtonProps | LinkButtonProps

const Button = ({
  type = 'button',
  children,
  icon,
  secondary,
  surface,
  ...props
}: ButtonProps) => {
  // Select which element to use.
  // This is done because the `as` prop didn't work well with goober
  let Element
  if ('href' in props) {
    Element = 'a'
  } else if ('to' in props) {
    Element = Link
  } else {
    Element = 'button'
  }
  return <Element
    className={ButtonStyleClass({
      $icon: icon && !children,
      $secondary: secondary,
      $surface: surface
    })}
    type={type as ButtonHTMLAttributes<HTMLButtonElement>['type']}
    {...props}
  >
    {icon}
    {children}
  </Element>
}

export default Button
