import { useSearchParams } from 'react-router-dom'

import { TutorialCard } from '../'
import { TutorialLeaf, TutorialSection } from '../../TutorialsPage'
import { CardsList } from './tutorialsSectionStyle'
import { isYoutube as getYtId } from '../utils'

type TutorialSectionProps = {
  pageInfo: TutorialSection
  pagePath: string[]
}

const TutorialsSection = ({ pageInfo, pagePath }: TutorialSectionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams()

  return <CardsList>
    {pageInfo.items.map((child: TutorialLeaf) => {
      const thumb = (child.type === 'item' && !child.thumbnail && getYtId(child.link))
        ? `https://i3.ytimg.com/vi/${getYtId(child.link)}/mqdefault.jpg`
        : child.thumbnail
      return <TutorialCard
        key={child.id}
        title={child.title}
        blurb={child.blurb}
        image={thumb}
        onClick={() => setSearchParams([...pagePath, child.id].join('&'))} />
    }
    )}
  </CardsList>
}

export default TutorialsSection
