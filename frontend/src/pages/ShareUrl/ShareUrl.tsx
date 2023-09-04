import { useState } from 'react'
import { Button, Input, Modal } from '/src/components'
import { useProjectStore } from '/src/stores'
import { dispatchCustomEvent } from '/src/util/events'
import { useEvent } from '/src/hooks'
import { InputWrapper } from '/src/components/InputDialogs/inputDialogsStyle'
import { Copy } from 'lucide-react'

const ShareUrl = () => {
  const project = useProjectStore(s => s.project)
  const base64Project = Buffer.from(JSON.stringify(project, null, 0)).toString('base64')
  const shareRawLink = `${window.location.origin}/share/raw/${base64Project}`

  const [exportUrlOpen, setExportUrlOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleClose = () => setExportUrlOpen(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(shareRawLink)
    setCopySuccess(true)
  }

  useEvent('showSharing', () => setExportUrlOpen(true))

  return <>
    <Modal
      title='Export Machine as URL'
      isOpen={exportUrlOpen}
      onClose={handleClose}
      actions={<Button secondary onClick={handleClose}>Close</Button>}
    >
      <InputWrapper>
        <Input
          readOnly
          value={shareRawLink}
        />
        <Button onClick={handleCopy} style={{ height: '100%' }}>
          <Copy size='18px' />
        </Button>
      </InputWrapper>
      {copySuccess ? <>Copied to clipboard!</> : <></>}
    </Modal>
  </>
}

export const showShareUrlDialog = () => {
  dispatchCustomEvent('showSharing', null)
}

export default ShareUrl
