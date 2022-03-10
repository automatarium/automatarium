import { Wrapper } from './buttonStyle'

const Button = ({
  type = 'button',
  ...props
}) => (
  <Wrapper
    type={type}
    {...props}
  />
)

export default Button