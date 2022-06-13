import { useEvent } from '/src/hooks'
import { useSelectionStore, useProjectStore } from '/src/stores'

const useImageExport = svgRef => {
  const selectNone = useSelectionStore(s => s.selectNone)
  const projectName = useProjectStore(s => s.project.meta.name)

  useEvent('exportImage', e => {
    selectNone() // Deselect all

    // After deselection
    window.setTimeout(() => {
      // Clone the SVG element
      const svgElement = svgRef.current?.cloneNode(true)

      // Set viewbox
      const b = document.querySelector('#automatarium-graph > g').getBBox()
      const border = 20 // Padding around view
      const [x, y, width, height] = [b.x - border, b.y - border, b.width + border*2, b.height + border*2]
      svgElement.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)

      // Replace colour variables
      const styles = getComputedStyle(svgRef.current)
      svgElement.style.fontFamily = styles.getPropertyValue('font-family')
      const svg = svgElement.outerHTML
        .replaceAll('var(--input-border)', styles.getPropertyValue('--input-border'))
        .replaceAll('var(--grid-bg)', styles.getPropertyValue('--grid-bg-light'))
        .replaceAll('var(--stroke)', styles.getPropertyValue('--stroke-light'))
        .replaceAll('var(--state-bg)', styles.getPropertyValue('--state-bg-light'))
        .replaceAll('var(--state-bg-selected)', styles.getPropertyValue('--state-bg-selected-light'))

      // Setup download link
      const link = document.createElement('a')
      link.download = `${projectName.replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '')}.${e.detail.type}`

      // Export SVG
      if (e.detail.type === 'svg') {
        link.href = 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<?xml version="1.0" standalone="no"?>\r\n'+svg)
        link.click()
        return
      }

      // Setup a canvas
      const canvas = document.createElement('canvas')
      canvas.height = height*2
      canvas.width = width*2
      const ctx = canvas.getContext('2d')
      if (e.detail.type === 'jpg') {
        ctx.fillStyle = styles.getPropertyValue('--grid-bg-light')
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      const img = new Image
      img.onload = () => {
        // Draw and save the image
        ctx.drawImage(img, 0, 0)
        link.href = canvas.toDataURL({png: 'image/png', jpg: 'image/jpeg'}[e.detail.type ?? 'png'])
        link.click()
      }
      img.src = 'data:image/svg+xml,'+encodeURIComponent(svg)
    }, 100)
  }, [svgRef.current, projectName])
}

export default useImageExport
