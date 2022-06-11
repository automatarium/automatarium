import { forwardRef } from 'react'

import { StyledInput } from './selectInputStyle'

const SelectInput = forwardRef(({
  color,
  ...props
}, ref) => (
  <StyledInput
    id={props.id ?? props.name}
    $color={color}
    {...props}
    ref={ref}
  />
))

export default SelectInput
