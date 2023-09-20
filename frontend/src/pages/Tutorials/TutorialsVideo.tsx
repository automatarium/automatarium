import { useSearchParams } from 'react-router-dom'
import { Button, Header, Main } from '/src/components'
import { TutorialLeaf } from './TutorialsPage'
import EmbeddedVideo from './YoutubeTutorialEmbed'

type TutorialVideoProps = {
  pageInfo: TutorialLeaf
  pagePath: string[]
}

const TutorialsVideo = ({ pageInfo, pagePath }: TutorialVideoProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams()

  const parseId = (link: string) => {
    const tokens = link.split('/') ?? null
    return tokens.find(tk => tk === 'youtu.be') === undefined ? null : tokens[tokens.length - 1]
  }

  const vidId = parseId(pageInfo.link)

  return <Main wide>
    <Header linkTo="/" />
    <h1>{pageInfo.title}</h1>
    {pagePath.length > 0 && <><Button onClick={() => setSearchParams(pagePath.slice(0, -1).join('&'))}>Go back</Button><br/></>}
    {<p>{pageInfo.description}</p>}
    {vidId && <EmbeddedVideo id={vidId}/>}
  </Main>
}

export default TutorialsVideo
