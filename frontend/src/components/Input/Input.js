import { forwardRef } from 'react'

import { StyledInput } from './inputStyle'

const Input = forwardRef(({
  type,
  color,
  small = false,
  ...props
}, ref) => (
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
