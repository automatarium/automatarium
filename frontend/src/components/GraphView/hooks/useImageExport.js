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
      const b = document.querySelector('body #automatarium-graph').getBBox()
      const border = 20 // Padding around view
      const [x, y, width, height] = [b.x - border, b.y - border, b.width + border*2, b.height + border*2]
      svgElement.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)

      // Replace colour variables
      const styles = getComputedStyle(document.body)
      svgElement.style.fontFamily = styles.getPropertyValue('font-family')
      const svg = svgElement.outerHTML
        .replaceAll('var(--input-border)', styles.getPropertyValue('--input-border'))
        .replaceAll('var(--grid-bg)', styles.getPropertyValue('--grid-bg-light'))
        .replaceAll('var(--stroke)', styles.getPropertyValue('--stroke-light'))
        .replaceAll('var(--state-bg)', styles.getPropertyValue('--state-bg-light'))
        .replaceAll('var(--state-bg-selected)', styles.getPropertyValue('--state-bg-selected-light'))

      // Setup a canvas
      const canvas = document.createElement('canvas')
      canvas.height = height*2
      canvas.width = width*2
      const ctx = canvas.getContext('2d')
      const img = new Image
      img.onload = () => {
        // Draw and save the image
        ctx.drawImage(img, 0, 0)
        const link = document.createElement('a')
        link.download = `${projectName.replace(/[\s]/g, '_').replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '')}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
      img.src = 'data:image/svg+xml,'+encodeURIComponent(svg)
    }, 100)
  }, [svgRef.current, projectName])
}

export default useImageExport
