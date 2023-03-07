import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { getProject } from '/src/services/project'
import { Spinner, ProjectCard, Button } from '/src/components'
import { useProjectStore } from '/src/stores'
import { Container } from './shareStyle'

const Share = () => {
  const { pid } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [sharedProject, setSharedProject] = useState()
  const setProject = useProjectStore(s => s.set)

  useEffect(() => {
    getProject(pid)
      .then(({ project }) => setSharedProject(project))
      .then(() => setLoading(false))
  }, [pid])

  const handleCopy = useCallback(() => {
    setProject({ ...sharedProject, _id: crypto.randomUUID(), userid: null })
    navigate('/editor')
  }, [pid, sharedProject])

  if (!sharedProject && !loading) navigate('/new')

  return (
    <Container>
      {loading
        ? <Spinner />
        : <>
        <ProjectCard
          disabled
          key={sharedProject._id}
          name={sharedProject.meta?.name}
          type={sharedProject.config?.type}
          date={dayjs(sharedProject.meta?.dateEdited)}
        />
        <Button onClick={handleCopy}>Make a copy</Button>
      </>}
    </Container>
  )
}

export default Share
