import { forwardRef } from 'react'

import { StyledInput, SwitchInput, StyledSwitch } from './inputStyle'

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

Input.Switch = forwardRef((props, ref) => (
  <>
    <SwitchInput id={props.id ?? props.name} type="checkbox" ref={ref} {...props} />
    <StyledSwitch><div /></StyledSwitch>
  </>
))

export default Input
