import { useNavigate } from 'react-router-dom'
import { Button, Header, Main } from '/src/components'
import { TutorialSection } from './TutorialsPage'

type TutorialSectionProps = {
  pageInfo: TutorialSection
  pagePath: string[]
}

const TutorialsSection = ({ pageInfo, pagePath }: TutorialSectionProps) => {
  const navigate = useNavigate()

  console.log(pagePath)

  return <Main wide>
    <Header linkTo="/" />
    <h1>{pageInfo.title}</h1>
    {pageInfo.items.map((child) =>
      <Button
        key={child.id}
        onClick={() => navigate(`${child.id}`)}>
          {child.title}
      </Button>
    )}
  </Main>
}

export default TutorialsSection
