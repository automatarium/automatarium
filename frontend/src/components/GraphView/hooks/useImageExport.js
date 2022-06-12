import { useEvent } from '/src/hooks'
import { useSelectionStore } from '/src/stores'

const useImageExport = svgRef => {
  const selectNone = useSelectionStore(s => s.selectNone)

  useEvent('exportImage', e => {
    console.log('Export', e.detail.type)
    selectNone()

    window.setTimeout(() => {
      const svgElement = svgRef.current?.cloneNode(true)

      // Replace colour variables
      const styles = getComputedStyle(document.body)
      svgElement.style.fontFamily = styles.getPropertyValue('font-family')
      const svg = svgElement.outerHTML
        .replaceAll('var(--input-border)', styles.getPropertyValue('--input-border'))
        .replaceAll('var(--grid-bg)', styles.getPropertyValue('--grid-bg-light'))
        .replaceAll('var(--stroke)', styles.getPropertyValue('--stroke-light'))
        .replaceAll('var(--state-bg)', styles.getPropertyValue('--state-bg-light'))
        .replaceAll('var(--state-bg-selected)', styles.getPropertyValue('--state-bg-selected-light'))

      // ...
      navigator.clipboard.writeText('data:image/svg+xml,'+encodeURIComponent(svg))
    }, 100)
  }, [svgRef.current])
}

export default useImageExport
