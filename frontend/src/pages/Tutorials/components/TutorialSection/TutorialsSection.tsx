import { useSearchParams } from 'react-router-dom'

import { TutorialSection } from '../../TutorialsPage'
import { CardsList } from './tutorialsSectionStyle'
import { TutorialCard } from '../'

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
        description={child.description}
        image={child.thumbnail}
        onClick={() => setSearchParams([...pagePath, child.id].join('&'))} />
    )}
  </CardsList>
}

export default TutorialsSection
