import { useSearchParams } from 'react-router-dom'

import { Button } from '/src/components'

import { TutorialSection } from './TutorialsPage'

type TutorialSectionProps = {
  pageInfo: TutorialSection
  pagePath: string[]
}

const TutorialsSection = ({ pageInfo, pagePath }: TutorialSectionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams()

  return <>
    {pageInfo.items.map((child) =>
      <Button
        key={child.id}
        onClick={() => setSearchParams([...pagePath, child.id].join('&'))}>
          {child.title}
      </Button>
    )}
  </>
}

export default TutorialsSection
