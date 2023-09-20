import { useParams, useSearchParams } from 'react-router-dom'
import manifest from '/src/config/tutorials-manifest.json'
import { NotFound, TutorialsSection, TutorialsVideo } from '/src/pages'
import { useEffect, useState } from 'react'
import { Spinner } from '/src/components'

interface TutorialLeaf {
  id: string
  title: string
  description: string
  type: 'item'
  link: string
}

interface TutorialSection {
  id: string
  title: string
  description: string
  type: 'section'
  items: [TutorialSection | TutorialLeaf]
}

type ManifestItem = TutorialLeaf | TutorialSection

type PageInfo = ManifestItem | 'not found'

const TutorialsPage = () => {
  const { id } = useParams()

  if (id === 'main') { return <TutorialsSection /> }

  const [searchParams] = useSearchParams()
  const [pageInfo, setPageInfo] = useState<PageInfo>()

  // Determine if section, leaf or not found
  const parentItem = manifest.items.find(mi => mi.id === id) as ManifestItem
  if (parentItem === undefined) { return <NotFound /> }

  const traceTree = (params: IterableIterator<string>, manifestState: ManifestItem) : PageInfo => {
    const iResult = params.next()
    console.log(iResult)
    console.log(manifestState)
    if (iResult.done) { return manifestState }
    // If the tree is a leaf and there is more then the page doesn't exist
    if (manifestState.type === 'item') { return 'not found' }

    const assertedSection = manifestState as TutorialSection
    const nextState = assertedSection.items.find((mi: ManifestItem) => mi.id === iResult.value)

    return traceTree(params, nextState)
  }

  useEffect(() => {
    setPageInfo(traceTree(searchParams.keys(), parentItem))
  }, [])

  if (pageInfo === undefined) {
    return <Spinner />
  } else if (pageInfo === 'not found') {
    return <NotFound />
  } else {
    return pageInfo.type === 'section'
      ? <TutorialsSection />
      : <TutorialsVideo />
  }
}

export default TutorialsPage
