import { useSearchParams } from 'react-router-dom'
import { Button, Header, Main } from '/src/components'
import { TutorialSection } from './TutorialsPage'

type TutorialSectionProps = {
  pageInfo: TutorialSection
  pagePath: string[]
}

const TutorialsSection = ({ pageInfo, pagePath }: TutorialSectionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams()

  return <Main wide>
    <Header linkTo="/" />
    <h1>{pageInfo.title}</h1>
    {pagePath.length > 0 && <><Button onClick={() => setSearchParams(pagePath.slice(0, -1).join('&'))}>Go back</Button><br /></>}
    {<p>{pageInfo.description}</p>}
    {pageInfo.items.map((child) =>
      <Button
        key={child.id}
        onClick={() => setSearchParams([...pagePath, child.id].join('&'))}>
          {child.title}
      </Button>
    )}
  </Main>
}

export default TutorialsSection
