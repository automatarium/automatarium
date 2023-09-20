import { useNavigate } from 'react-router-dom'
import { Button, Header, Main } from '/src/components'
import { TutorialLeaf } from './TutorialsPage'

type TutorialVideoProps = {
  pageInfo: TutorialLeaf
  pagePath: string[]
}

const TutorialsVideo = ({ pageInfo }: TutorialVideoProps) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate('/')
  }

  return <Main wide>
    <Header linkTo="/" />
    <h1>{pageInfo.title}</h1>
    This is a leaf page.
    <Button onClick={handleCardClick}>Go home</Button>
  </Main>
}

export default TutorialsVideo
