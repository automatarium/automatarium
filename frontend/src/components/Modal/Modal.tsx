import { createPortal } from 'react-dom'
import { CSSProperties, HTMLAttributes, ReactNode, RefObject, useEffect } from 'react'
import { useA11yDialog } from 'react-a11y-dialog'

import { Button } from '/src/components'

import { Buttons, Children, Container, Content, Description, Heading, Overlay } from './modalStyle'

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  description?: string
  actions?: ReactNode
  isOpen?: boolean
  role?: 'dialog' | 'alertdialog'
  onClose?: () => void
  focusRef?: RefObject<HTMLElement>
  dropdown?: boolean
  containerStyle?: CSSProperties
  width?: string | number
}

const Modal = ({
  id = 'dialog',
  role = 'dialog',
  title,
  description,
  children,
  actions,
  isOpen,
  onClose,
  focusRef,
  dropdown = false,
  containerStyle,
  width,
  ...props
}: ModalProps) => {
  const [instance, attr] = useA11yDialog({ id, role, title })

  useEffect(() => {
    if (isOpen) {
      instance?.show()
    } else {
      instance?.hide()
    }
  }, [instance, isOpen])

  useEffect(() => {
    if (!instance) return
    onClose && instance.on('hide', onClose)
    focusRef?.current && instance.on('show', () => setTimeout(() => focusRef.current?.focus(), 100))
  }, [instance, onClose, focusRef?.current])

  return createPortal(
    <Container
      {...attr.container}
      className={dropdown ? 'dropdown' : ''}
      style={containerStyle}
    >
      <Overlay {...attr.overlay} />

      <Content {...attr.dialog} style={{ width }}>
        {title && <Heading {...attr.title}>{title}</Heading>}
        {description && <Description>{description}</Description>}

        <Children {...props}>
          {children}
        </Children>

        <Buttons>
          {actions ?? <Button {...attr.closeButton} secondary>Close</Button>}
        </Buttons>
      </Content>
    </Container>,
    document.body
  )
}

export default Modal
