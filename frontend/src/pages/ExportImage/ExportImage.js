import { useEffect, useCallback, useState } from 'react'

import { Preference, Input, Modal, Button, Switch } from '/src/components'
import { useExportStore, useProjectStore } from '/src/stores'
import { downloadURL, getSvgString, svgToCanvas } from '/src/hooks/useImageExport'

import { Wrapper, Image } from './exportImageStyle'

const ExportImage = () => {
  const { exportVisible, setExportVisible, options, setOptions } = useExportStore()
  const { filename, type, margin, color, darkMode, background } = options
  const projectName = useProjectStore(s => s.project?.meta.name)
  const projectColor = useProjectStore(s => s.project?.config.color)
  const [svg, setSvg] = useState()
  const [size, setSize] = useState({})
  const [preview, setPreview] = useState('#')
  const [prevBG, setPrevBG] = useState()

  // Set project settings if they change
  useEffect(() => {
    setOptions({ filename: projectName, color: projectColor })
  }, [projectName, projectColor])

  // Set svg
  useEffect(() => {
    if (!exportVisible) return
    const { height, width, svg } = getSvgString({ margin, background, color, darkMode })
    setSvg(svg)
    setSize({ height, width })
  }, [margin, color, darkMode, background, exportVisible])

  useEffect(() => {
    if (type === 'svg') {
      setPreview('data:image/svg+xml,' + encodeURIComponent(svg))
    } else {
      svgToCanvas({ ...size, svg })
        .then(canvas => setPreview(canvas.toDataURL(type === 'jpg' && 'image/jpeg')))
    }
  }, [svg, size, type])

  // Prevent transparent background for JPG
  useEffect(() => {
    if (type === 'jpg' && background === 'none') {
      setPrevBG(background)
      setOptions({ background: 'solid' })
    } else if (type !== 'jpg' && prevBG) {
      setOptions({ background: prevBG })
      setPrevBG(undefined)
    }
  }, [type, prevBG, background])

  const doExport = useCallback(async () => {
    let data

    // SVG export
    if (type === 'svg') {
      data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<?xml version="1.0" standalone="no"?>\r\n' + svg)
    }

    // PNG/JPG export
    if (type === 'png' || type === 'jpg') {
      const canvas = await svgToCanvas({ ...size, svg })
      data = canvas.toDataURL(type === 'jpg' && 'image/jpeg')
    }

    // Download file
    if (data) downloadURL({ filename, extension: type, data })
  }, [svg, size, type, filename])

  const copyToClipboard = useCallback(async () => {
    if (type === 'svg') {
      // TODO: kinda broken, might need to clean the svg at an earlier stage
      const blob = new Blob([svg], { type: 'text/plain' })
      navigator.clipboard.write([new window.ClipboardItem({ 'text/plain': blob })])
    }

    if (type === 'png' || type === 'jpg') {
      const canvas = await svgToCanvas({ ...size, svg })
      canvas.toBlob(blob => navigator.clipboard.write([new window.ClipboardItem({ [type === 'jpg' ? 'image/jpeg' : 'image/png']: blob })]), type === 'jpg' && 'image/jpeg')
    }

    setExportVisible(false)
  }, [svg, size, type, filename])

  return (
    <Modal
      title="Export Image"
      description="Download an image of your project"
      isOpen={exportVisible}
      onClose={() => setExportVisible(false)}
      actions={<>
        <Button secondary onClick={() => setExportVisible(false)}>Cancel</Button>
        <div style={{ flex: 1 }} />
        <Button secondary onClick={copyToClipboard}>Copy to clipboard</Button>
        <Button onClick={doExport}>Export</Button>
      </>}
      width="800px"
    >
      <Wrapper>
        <Image src={preview} alt="" />
        <div>
          <Preference label="File name" fullWidth>
            <Input small value={filename} onChange={e => setOptions({ filename: e.target.value })} />
          </Preference>
          <Preference label="File type" fullWidth>
            <Input type="select" small value={type} onChange={e => setOptions({ type: e.target.value })}>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="svg">SVG</option>
            </Input>
          </Preference>
          {type === 'svg' && <span style={{ fontSize: '.7em', display: 'block', maxWidth: 'fit-content', color: 'var(--error)' }}>Note: SVG exporting is still in beta and may not work as expected</span>}
          <Preference label="Margin" fullWidth>
            <Input type="number" min="0" max="500" small value={margin} onChange={e => setOptions({ margin: e.target.value === '' ? e.target.value : Math.min(Math.max(e.target.value, 0), 500) })} />
          </Preference>
          <Preference label="Accent colour" fullWidth>
            <Input type="select" small value={color} onChange={e => setOptions({ color: e.target.value })}>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="green">Green</option>
              <option value="teal">Teal</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
            </Input>
          </Preference>
          <Preference label="Background" fullWidth>
            <Input type="select" small value={background} onChange={e => setOptions({ background: e.target.value })}>
              <option value="solid">Solid</option>
              <option value="none" disabled={type === 'jpg'}>Transparent</option>
              {/* <option value="grid">Dot grid</option> */}
            </Input>
          </Preference>
          <Preference label="Dark mode">
            <Switch checked={darkMode} onChange={e => setOptions({ darkMode: e.target.checked })} />
          </Preference>
        </div>
      </Wrapper>
    </Modal>
  )
}

export default ExportImage
