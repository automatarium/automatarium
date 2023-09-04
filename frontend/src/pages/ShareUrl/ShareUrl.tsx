import { useEffect, useState } from 'react'
import { useEvent } from '/src/hooks'

import { useProjectStore } from '/src/stores'

import { Copy } from 'lucide-react'
import { Button, Input, Modal } from '/src/components'

import { CopyRowWrapper, CopySuccessDiv } from './shareUrlStyle'

const ShareUrl = () => {
  const project = useProjectStore(s => s.project)
  const base64Project = Buffer.from(JSON.stringify(project, null, 0)).toString('base64')
  const shareRawLink = `${window.location.origin}/share/raw/${base64Project}`

  const [exportUrlOpen, setExportUrlOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [dataCopySuccess, setDataCopySuccess] = useState(false)

  const handleClose = () => {
    setExportUrlOpen(false)
    setCopySuccess(false)
    setDataCopySuccess(false)
  }

  useEffect(() => {
    const timeout = setTimeout(() => setCopySuccess(false), 3000)
    return () => clearTimeout(timeout)
  }, [copySuccess])

  useEffect(() => {
    const timeout = setTimeout(() => setDataCopySuccess(false), 3000)
    return () => clearTimeout(timeout)
  }, [dataCopySuccess])

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareRawLink)
    setCopySuccess(true)
  }

  const handleCopyEncoding = () => {
    navigator.clipboard.writeText(base64Project)
    setDataCopySuccess(true)
  }

  useEvent('showSharing', () => setExportUrlOpen(true))

  return <>
    <Modal
      title='Export Machine as URL'
      isOpen={exportUrlOpen}
      onClose={handleClose}
      actions={<Button secondary onClick={handleClose}>Close</Button>}
    >
      You can copy and paste as the raw data
      <CopyRowWrapper>
        <Input
          readOnly
          value={base64Project}
        />
        <Button onClick={handleCopyEncoding} style={{ height: '100%' }}>
          <Copy size='18px' />
        </Button>
      </CopyRowWrapper>
      {dataCopySuccess ? <CopySuccessDiv>Copied to clipboard!</CopySuccessDiv> : <></>}
      URL
      <CopyRowWrapper>
        <Input
          readOnly
          value={shareRawLink}
        />
        <Button onClick={handleCopyUrl} style={{ height: '100%' }}>
          <Copy size='18px' />
        </Button>
      </CopyRowWrapper>
      {copySuccess ? <CopySuccessDiv>Copied to clipboard!</CopySuccessDiv> : <></>}
      <hr />
    </Modal>
  </>
}

export default ShareUrl
