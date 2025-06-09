import { useLayoutEffect, useState } from 'react'
import { isYoutube } from '../utils'
import { useTranslation } from 'react-i18next'

const EmbeddedVideo = ({ link }) => {
  const { t } = useTranslation('tutorials')
  const [aspectRatios, setAspectRatio] = useState([560, 315])

  const updateRatios = () => {
    const usableWidth = window.innerWidth > 1200 ? 1136 : window.innerWidth - 64
    const videoHeight = usableWidth * (315 / 560)
    setAspectRatio([usableWidth, videoHeight])
  }

  useLayoutEffect(() => {
    updateRatios()

    window.addEventListener('resize', updateRatios)

    return () => {
      window.removeEventListener('resize', updateRatios)
    }
  }, [])

  const vidId = isYoutube(link)

  return vidId && <>
      <p />
      <iframe
        width={aspectRatios[0]}
        height={aspectRatios[1]}
        src={`https://www.youtube.com/embed/${vidId}`}
        allow="accelerometer; clipboard-write; encrypted-media"
        allowFullScreen
        title={t('components.tutorial_video')}
      />
    </>
}

export default EmbeddedVideo
