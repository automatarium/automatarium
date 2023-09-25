import { useSearchParams } from 'react-router-dom'

import { TutorialCard } from '../'
import { TutorialSection } from '../../TutorialsPage'
import { CardsList } from './tutorialsSectionStyle'

type TutorialSectionProps = {
  pageInfo: TutorialSection
  pagePath: string[]
}

const TutorialsSection = ({ pageInfo, pagePath }: TutorialSectionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams()

  return <CardsList>
    {pageInfo.items.map((child) =>
      <TutorialCard
        key={child.id}
        title={child.title}
        blurb={child.blurb}
        image={child.thumbnail}
        onClick={() => setSearchParams([...pagePath, child.id].join('&'))} />
    )}
  </CardsList>
}

export default TutorialsSection
