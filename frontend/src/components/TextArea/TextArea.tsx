import { ForwardedRef, forwardRef, TextareaHTMLAttributes } from 'react'

import { InputColor, StyledTextArea } from './textAreaStyle'

interface InputProps {
  type?: string
  color?: InputColor
  small?: boolean
}

const TextArea = forwardRef(({
  type,
  ...props
}: InputProps & TextareaHTMLAttributes<HTMLTextAreaElement>, ref: ForwardedRef<HTMLTextAreaElement>) => (
  <StyledTextArea
    id={props.id ?? props.name}
    {...props}
    as={type === 'select' ? 'select' : 'textarea'}
    ref={ref}
    {...(type && type !== 'textarea' ? { type } : {})}
  />
))

export default TextArea
