import { useEffect, useCallback, useState } from 'react'

import { Preference, Input, Modal, Button, Switch } from '/src/components'
import { useExportStore, useProjectStore } from '/src/stores'
import { downloadURL, getSvgString, svgToCanvas } from '/src/hooks/useImageExport'

import { Wrapper, Image } from './exportImageStyle'
import { Size } from '/src/types/ProjectTypes'
import { ColourName } from '/src/config'
import { Background } from '/src/stores/useExportStore'
import { useTranslation } from 'react-i18next'

const ExportImage = () => {
  const { exportVisible, setExportVisible, options, setOptions } = useExportStore()
  const { filename, type, margin, color, darkMode, background } = options
  const projectName = useProjectStore(s => s.project?.meta.name)
  const projectColor = useProjectStore(s => s.project?.config.color)
  const [svg, setSvg] = useState<string>()
  const [size, setSize] = useState<Size>({} as Size)
  const [preview, setPreview] = useState('#')
  const [prevBG, setPrevBG] = useState<'solid' | 'none'>()
  const { t } = useTranslation('common')

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
    if (data) downloadURL(filename, type, data)
  }, [svg, size, type, filename])

  const copyToClipboard = useCallback(async () => {
    if (type === 'svg') {
      // TODO: kinda broken, might need to clean the svg at an earlier stage
      const blob = new Blob([svg], { type: 'text/plain' })
      await navigator.clipboard.write([new window.ClipboardItem({ 'text/plain': blob })])
    } else if (type === 'png') {
      const canvas = await svgToCanvas({ ...size, svg })
      canvas.toBlob(blob => navigator.clipboard.write([
        new window.ClipboardItem({ 'image/png': blob })
      ]))
    }

    setExportVisible(false)
  }, [svg, size, type, filename])

  return (
    <Modal
      title={t('export_image.title')}
      description={t('export_image.description')}
      isOpen={exportVisible}
      onClose={() => setExportVisible(false)}
      actions={<>
        <Button secondary onClick={() => setExportVisible(false)}>{t('cancel')}</Button>
        <div style={{ flex: 1 }}/>
        {/*
            Currently jpg is not supported for the ClipboardItem API.
            See https://stackoverflow.com/a/69536762
         */}
        <Button disabled={type === 'jpg'} secondary onClick={copyToClipboard}>{t('export_image.copy')}</Button>
        <Button onClick={doExport}>{t('export')}</Button>
      </>}
      width="800px"
    >
      <Wrapper>
        <Image src={preview} alt=""/>
        <div>
          <Preference label={t('export_image.file_name')} fullWidth>
            <Input small value={filename} onChange={e => setOptions({ filename: e.target.value })}/>
          </Preference>
          <Preference label={t('export_image.file_type')} fullWidth>
            <Input type="select" small value={type} onChange={e => setOptions({ type: e.target.value })}>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="svg">SVG</option>
            </Input>
          </Preference>
          {type === 'svg' &&
              <span style={{ fontSize: '.7em', display: 'block', maxWidth: 'fit-content', color: 'var(--error)' }}>{t('export_image.svg_note')}</span>}
          <Preference label={t('export_image.margin')} fullWidth>
            <Input type="number" min="0" max="500" small value={margin}
                   onChange={e => setOptions({ margin: e.target.value === '' ? 0 : Math.min(Math.max(Number(e.target.value), 0), 500) })}/>
          </Preference>
          <Preference label={t('export_image.accent_colour')} fullWidth>
            <Input type="select" small value={color} onChange={e => setOptions({ color: e.target.value as ColourName })}>
              <option value="red">{t('export_image.red')}</option>
              <option value="orange">{t('export_image.orange')}</option>
              <option value="green">{t('export_image.green')}</option>
              <option value="teal">{t('export_image.teal')}</option>
              <option value="blue">{t('export_image.blue')}</option>
              <option value="purple">{t('export_image.purple')}</option>
              <option value="pink">{t('export_image.pink')}</option>
            </Input>
          </Preference>
          <Preference label={t('export_image.background')} fullWidth>
            <Input type="select" small value={background} onChange={e => setOptions({ background: e.target.value as Background })}>
              <option value="solid">{t('export_image.solid')}</option>
              <option value="none" disabled={type === 'jpg'}>{t('export_image.transparent')}</option>
              {/* <option value="grid">Dot grid</option> */}
            </Input>
          </Preference>
          <Preference label={t('export_image.dark_mode')}>
            <Switch checked={darkMode} onChange={e => setOptions({ darkMode: e.target.checked })}/>
          </Preference>
        </div>
      </Wrapper>
    </Modal>
  )
}

export default ExportImage
