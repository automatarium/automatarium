import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Spinner } from '/src/components'
import { useProjectStore } from '/src/stores'
import { Container } from './shareStyle'

import { useParseFile } from '/src/hooks/useActions'
import { showWarning } from '/src/components/Warning/Warning'

const Share = () => {
  const { type, data } = useParams()
  const navigate = useNavigate()
  const setProject = useProjectStore(s => s.set)

  useEffect(() => {
    switch (type) {
      case 'raw': {
        const decodedJson = Buffer.from(data, 'base64').toString()
        const dataJson = new File([decodedJson], 'Shared Project')
        useParseFile(setProject, 'Failed to load file.', dataJson, handleLoadSuccess, handleLoadFail)
        break
      }
      default: {
        showWarning(`Unknown share type ${type}`)
        handleLoadFail()
        break
      }
    }
  }, [data])

  const handleLoadSuccess = () => {
    navigate('/editor')
  }

  const handleLoadFail = () => {
    navigate('/new')
  }

  return (
    <Container>
      <Spinner />
    </Container>
  )
}

export default Share
