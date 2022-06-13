import { forwardRef } from 'react'

import { SwitchInput, StyledSwitch } from './switchStyle'

const Switch = forwardRef((props, ref) => (
  <label>
    <SwitchInput id={props.id ?? props.name} type="checkbox" ref={ref} {...props} />
    <StyledSwitch><div /></StyledSwitch>
  </label>
))

export default Switch
