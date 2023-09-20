import { useNavigate } from 'react-router-dom'
import { Button, Header, Main } from '/src/components'

const TutorialsLeaf = () => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate('/')
  }

  return <Main wide>
    <Header linkTo="/" />
    This is a leaf page.
    <Button onClick={handleCardClick}>Go home</Button>
  </Main>
}

export default TutorialsLeaf
