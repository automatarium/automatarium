import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button, Header, Main } from '/src/components'
import { NotFound, TutorialsSection } from '/src/pages'

import { Title, TitleRow } from './tutorialsStyle'
import EmbeddedVideo from './YoutubeTutorialEmbed'

import manifest from '/src/config/tutorials-manifest.json'

export interface TutorialLeaf {
  id: string
  title: string
  description: string
  type: 'item'
  link: string
}

export interface TutorialSection {
  id: string
  title: string
  description: string
  type: 'section'
  items: [TutorialSection | TutorialLeaf]
}

type ManifestItem = TutorialLeaf | TutorialSection
type PageInfo = ManifestItem | 'not found'

const TutorialsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [pageInfo, setPageInfo] = useState<PageInfo>()
  const [pagePath, setPagePath] = useState<string[]>()

  const navigate = useNavigate()

  // Determine if section, leaf or not found
  const traceTree = (params: IterableIterator<string>, manifestState: ManifestItem, path: string[] = []) : PageInfo => {
    const iResult = params.next()
    if (iResult.done) {
      setPagePath(path)
      return manifestState
    }
    // If the tree is a leaf and there is more then the page doesn't exist
    if (manifestState.type === 'item') { return 'not found' }

    const assertedSection = manifestState as TutorialSection
    const nextState = assertedSection.items.find((mi: ManifestItem) => mi.id === iResult.value)
    const nextPath = [...path, nextState.id]

    return traceTree(params, nextState, nextPath)
  }

  useEffect(() => {
    setPageInfo(traceTree(searchParams.keys(), manifest as ManifestItem))
  }, [searchParams])

  if (pageInfo === undefined || pageInfo === 'not found') {
    return <NotFound />
  } else {
    return <Main wide>
      <Header linkTo="/" />
      <TitleRow>
        <Title>{pageInfo.title}</Title>
        {pagePath.length > 0
          ? <Button onClick={() => setSearchParams(pagePath.slice(0, -1).join('&'))}>Go back</Button>
          : <Button onClick={() => navigate('/')}>Return home</Button>}
      </TitleRow>

      {<p>{pageInfo.description}</p>}

      {pageInfo.type === 'section'
        ? <TutorialsSection pageInfo={pageInfo} pagePath={pagePath} />
        : <EmbeddedVideo link={pageInfo.link} />}
    </ Main>
  }
}

export default TutorialsPage
