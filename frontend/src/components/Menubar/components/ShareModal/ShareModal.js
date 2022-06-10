import { useCallback, useState } from 'react'

import { Button, Modal, TextInput } from '/src/components'
import config from '/src/config'

import { Container } from './shareModalStyle'

const ShareModal = ({ projectId, ...props }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [projectId])

  const shareUrl = `${config.baseUrl}/share/${projectId}`

  return <Modal
    narrow
    actions={<>
      <Button onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</Button>
    </>}
    {...props}
  >
    <Container>
      <h2>Share</h2>
      <TextInput readOnly value={shareUrl} />
    </Container>
  </Modal>
}

export default ShareModal
