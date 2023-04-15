import { useEffect } from 'react'

import { useEvent } from '/src/hooks'
import { useProjectStore, useExportStore, useThumbnailStore } from '/src/stores'
import COLORS from '/src/config/colors'

const SVG_NS = 'http://www.w3.org/2000/svg'

// Download a URL with a specific filename
export const downloadURL = ({ filename, extension, data }) => {
  const link = document.createElement('a')
  link.download = `${filename.replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '')}.${extension}`
  link.href = data
  link.click()
}

// Render an SVG on a canvas
export const svgToCanvas = ({ height, width, svg }) => new Promise(resolve => {
  // Setup canvas
  const canvas = document.createElement('canvas')
  canvas.height = height * 2
  canvas.width = width * 2
  const ctx = canvas.getContext('2d')

  // Create an image to render
  const img = new Image()
  img.onload = () => {
    // Draw and save the image
    ctx.drawImage(img, 0, 0)
    resolve(canvas)
  }
  img.src = 'data:image/svg+xml,' + encodeURIComponent(svg)
})

// Extract the SVG graph as a string
export const getSvgString = ({
  margin = 20,
  background = 'none',
  color,
  darkMode = false
} = {}) => {
  // Clone the SVG element
  const svgElement = document.querySelector('#automatarium-graph')
  const clonedSvgElement = svgElement.cloneNode(true)

  // Set viewbox
  const b = document.querySelector('#automatarium-graph > g').getBBox()
  margin = Number(margin ?? 0) + 1
  const [x, y, width, height] = [b.x - margin, b.y - margin, b.width + margin * 2, b.height + margin * 2]
  clonedSvgElement.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)
  clonedSvgElement.setAttribute('width', width * 2 + 'px')
  clonedSvgElement.setAttribute('height', height * 2 + 'px')
  // If changing colour, save what is on the actual svg, then change them temporarily
  // This is done because we need to recompute the variables below, and we can't
  // change the variables on the cloned element, as it's not attached to the DOM
  // and doesn't receive styles from the stylesheet
  const prevColor = {
    h: svgElement.style.getPropertyValue('--primary-h'),
    s: svgElement.style.getPropertyValue('--primary-s'),
    l: svgElement.style.getPropertyValue('--primary-l')
  }
  if (color) {
    const c = COLORS[color] ?? COLORS.orange
    svgElement.style.setProperty('--primary-h', c.h)
    svgElement.style.setProperty('--primary-s', `${c.s}%`)
    svgElement.style.setProperty('--primary-l', `${c.l}%`)
  }

  // Get computed styles from the svg
  const styles = getComputedStyle(svgElement)
  const theme = darkMode ? 'dark' : 'light'

  // Background
  if (background === 'solid') {
    // Create a rect to fill the SVG background
    const bg = document.createElementNS(SVG_NS, 'rect')
    bg.setAttributeNS(SVG_NS, 'fill', styles.getPropertyValue(`--grid-bg-${theme}`))
    bg.setAttributeNS(SVG_NS, 'x', x)
    bg.setAttributeNS(SVG_NS, 'y', y)
    bg.setAttributeNS(SVG_NS, 'width', width)
    bg.setAttributeNS(SVG_NS, 'height', height)
    clonedSvgElement.prepend(bg)
  } else if (background === 'grid') {
    // TODO: draw dot grid with SVG
  }

  // Replace colour variables
  clonedSvgElement.style.fontFamily = styles.getPropertyValue('font-family')
  const svg = clonedSvgElement.outerHTML
    .replaceAll('var(--initial-arrow-bg, var(--grid-bg))', 'none')
    .replaceAll('var(--input-border)', styles.getPropertyValue('--input-border'))
    .replaceAll('var(--grid-bg)', styles.getPropertyValue(`--grid-bg-${theme}`))
    .replaceAll('var(--stroke)', styles.getPropertyValue(`--stroke-${theme}`))
    .replaceAll('var(--primary)', styles.getPropertyValue(`--stroke-${theme}`))
    .replaceAll('var(--state-bg)', styles.getPropertyValue(`--state-bg-${theme}`))
    .replaceAll('var(--state-bg-selected)', styles.getPropertyValue(`--state-bg-${theme}`))
    .replaceAll('var(--comment-text)', styles.getPropertyValue(`--comment-text-${theme}`))

  // If changing colour, reset the actual svg back to what it was previously
  if (color) {
    svgElement.style.setProperty('--primary-h', prevColor.h)
    svgElement.style.setProperty('--primary-s', prevColor.s)
    svgElement.style.setProperty('--primary-l', prevColor.l)
  }

  return { svg, height, width }
}

const useImageExport = () => {
  const project = useProjectStore(s => s.project)
  const setExportVisible = useExportStore(s => s.setExportVisible)
  const setThumbnail = useThumbnailStore(s => s.setThumbnail)

  useEvent('exportImage', async e => {
    // Detailed export
    if (!e.detail?.type) return setExportVisible(true)

    // Get the svg string
    const { svg, height, width } = getSvgString()

    // Quick export SVG
    if (e.detail?.type === 'svg') {
      return downloadURL({
        filename: project.meta.name,
        extension: 'svg',
        data: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<?xml version="1.0" standalone="no"?>\r\n' + svg)
      })
    }

    // Quick export PNG
    if (e.detail?.type === 'png') {
      const canvas = await svgToCanvas({ height, width, svg })

      // Export to clipboard
      if (e.detail.clipboard) {
        return canvas.toBlob(blob => navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]))
      }

      return downloadURL({
        filename: project.meta.name,
        extension: 'png',
        data: canvas.toDataURL()
      })
    }
  }, [project.meta.name])

  // Generate thumbnail
  useEffect(() => window.setTimeout(() => {
    const { svg } = getSvgString()
    setThumbnail(project._id, 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<?xml version="1.0" standalone="no"?>\r\n' + svg))
  }, 200), [project])
}

export default useImageExport
