import React, { forwardRef } from 'react'

import { SwitchInput, StyledSwitch } from './switchStyle'

type SwitchProps = React.InputHTMLAttributes<HTMLInputElement> & {name?: string}

const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => (
  <label>
    <SwitchInput id={props.id ?? props.name} type="checkbox" ref={ref} {...props} />
    <StyledSwitch><div /></StyledSwitch>
  </label>
))

export default Switch
