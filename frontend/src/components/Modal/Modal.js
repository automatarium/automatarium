import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { useA11yDialog } from 'react-a11y-dialog'

import { Heading, Button } from '../'

import { Container, Overlay, Content, Buttons } from './modalStyle'

const Modal = ({
  id = 'dialog',
  role = 'dialog',
  title,
  children,
  actions,
  isOpen,
  onClose,
  focusRef,
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
    <Container {...attr.container}>
      <Overlay {...attr.overlay} />

      <Content {...attr.dialog}>
        <Heading {...attr.title} size="h2">{title}</Heading>

        {children}

        <Buttons>
          {actions ?? <Button {...attr.closeButton} secondary surface>Close</Button>}
        </Buttons>
      </Content>
    </Container>,
    document.body
  )

  return dialog
}

export default Modal
