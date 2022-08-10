import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { useA11yDialog } from 'react-a11y-dialog'

import { Button } from '/src/components'

import {
  Container,
  Overlay,
  Content,
  Buttons,
  Children,
  Heading,
  Description,
} from './modalStyle'

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
}) => {
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

  const dialog = createPortal(
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

  return dialog
}

export default Modal
