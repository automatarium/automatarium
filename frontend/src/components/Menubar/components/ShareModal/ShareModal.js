import { useCallback, useState } from 'react'

import { Button, Modal, Input } from '/src/components'
import config from '/src/config'

const ShareModal = ({ projectId, ...props }) => {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${config.baseUrl}/share/${projectId}`

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [projectId])

  return (
    <Modal
      title="Share this project"
      description="This link lets others make a copy of your project"
      actions={<Button onClick={handleCopy} disabled={copied}>{copied ? 'Copied!' : 'Copy to clipboard'}</Button>}
      dropdown
      containerStyle={{
        position: 'absolute',
        left: 'initial',
        bottom: 'initial',
        right: '1rem',
        top: '2rem',
      }}
      {...props}
    >
      <Input readOnly value={shareUrl} />
    </Modal>
  )
}

export default ShareModal
