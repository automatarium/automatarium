import { forwardRef } from 'react'

import { StyledInput } from './textInputStyle'

const TextInput = forwardRef(({
  type,
  color,
  ...props
}, ref) => (
  <StyledInput
    id={props.id ?? props.name}
    $color={color}
    {...props}
    type={type || 'text'}
    ref={ref}
  />
))

export default TextInput
