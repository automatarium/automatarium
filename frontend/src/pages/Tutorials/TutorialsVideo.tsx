import { TutorialLeaf } from './TutorialsPage'
import EmbeddedVideo from './YoutubeTutorialEmbed'

type TutorialVideoProps = {
  pageInfo: TutorialLeaf
  pagePath: string[]
}

const TutorialsVideo = ({ pageInfo }: TutorialVideoProps) => {
  const parseId = (link: string) => {
    const tokens = link.split('/') ?? null
    return tokens.find(tk => tk === 'youtu.be') === undefined ? null : tokens[tokens.length - 1]
  }

  const vidId = parseId(pageInfo.link)

  return vidId && <EmbeddedVideo id={vidId}/>
}

export default TutorialsVideo
