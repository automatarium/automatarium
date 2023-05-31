import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react'

import { InputColor, StyledInput } from './inputStyle'

interface InputProps {
  type?: string
  color?: InputColor
  small?: boolean
}

const Input = forwardRef(({
  type,
  color,
  small = false,
  ...props
}: InputProps & InputHTMLAttributes<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement>) => (
  <StyledInput
    id={props.id ?? props.name}
    $color={color}
    $small={small}
    {...props}
    as={type === 'select' ? 'select' : 'input'}
    type={type}
    ref={ref}
  />
))

export default Input
