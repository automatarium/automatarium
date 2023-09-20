import { useNavigate, useParams } from 'react-router-dom'
import { Button, Header, Main } from '/src/components'
import manifest from '/src/config/tutorials-manifest.json'

interface TutorialLeaf {
  id: string,
  name: string,
  description: string,
  link: string
}

interface TutorialSection {
  id: string,
  name: string,
  description: string,
  items: [TutorialSection | TutorialLeaf]
}

type ManifestItem = TutorialLeaf | TutorialSection

const TutorialsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Determine if section, leaf or not found
  console.log(id)
  console.log(manifest)

  const handleCardClick = () => {
    navigate('/')
  }

  return <Main wide>
    <Header linkTo="/" />
    This is a section.
    <Button onClick={handleCardClick}>Go home</Button>
  </Main>
}

export default TutorialsPage
