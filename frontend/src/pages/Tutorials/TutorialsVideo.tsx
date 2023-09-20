import { useSearchParams } from 'react-router-dom'
import { Button, Header, Main } from '/src/components'
import { TutorialLeaf } from './TutorialsPage'

type TutorialVideoProps = {
  pageInfo: TutorialLeaf
  pagePath: string[]
}

const TutorialsVideo = ({ pageInfo, pagePath }: TutorialVideoProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams()

  return <Main wide>
    <Header linkTo="/" />
    <h1>{pageInfo.title}</h1>
    {pagePath.length > 0 && <><Button onClick={() => setSearchParams(pagePath.slice(0, -1).join('&'))}>Go back</Button><br/></>}
    This is a leaf page.
  </Main>
}

export default TutorialsVideo
