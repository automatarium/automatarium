import { forwardRef } from 'react'

import { StyledInput } from './textInputStyle'

const TextInput = forwardRef((props, ref) => (
  <StyledInput
    id={props.name}
    {...props}
    type={props.type || 'text'}
    ref={ref}
  />
))

export default TextInput
