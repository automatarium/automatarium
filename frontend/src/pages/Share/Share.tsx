import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Spinner } from '/src/components'
import { useProjectStore } from '/src/stores'
import { Container } from './shareStyle'

import { useParseFile } from '/src/hooks/useActions'

const Share = () => {
  const { data } = useParams()
  const navigate = useNavigate()
  const setProject = useProjectStore(s => s.set)

  useEffect(() => {
    const dataJson = new File([data], 'Shared Project')
    useParseFile(setProject, 'Failed to load file.', dataJson, handleLoadSuccess, handleLoadFail)
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
