import dayjs from 'dayjs'
import { Settings } from 'lucide-react'
import { RefObject, createRef, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Header, Main, ProjectCard } from '/src/components'
import { PROJECT_THUMBNAIL_WIDTH } from '/src/config/rendering'
import { ImportDialog } from '/src/pages'
import { usePreferencesStore, useProjectStore, useProjectsStore, useThumbnailStore } from '/src/stores'
import { StoredProject, createNewProject } from '/src/stores/useProjectStore' // #HACK
import { dispatchCustomEvent } from '/src/util/events'

import { CardList, DeleteConfirmationDialog, NewProjectCard } from './components'
import FSA from './images/FSA'
import PDA from './images/PDA'
import TM from './images/TM'
import { ButtonGroup, HeaderRow, NoResultSpan, PreferencesButton } from './newFileStyle'
import KebabMenu from '/src/components/KebabMenu/KebabMenu'
import { Coordinate, ProjectType } from '/src/types/ProjectTypes'

const NewFile = () => {
  const navigate = useNavigate()
  const projects = useProjectsStore(s => s.projects)
  const setProject = useProjectStore(s => s.set)
  const thumbnails = useThumbnailStore(s => s.thumbnails)
  const removeThumbnail = useThumbnailStore(s => s.removeThumbnail)
  const preferences = usePreferencesStore(state => state.preferences)
  // We find the tallest card using method shown here
  // https://legacy.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const [height, setHeight] = useState(0)
  const cardsRef = useCallback((node: HTMLDivElement) => {
    if (node === null) return
    // Get the height of the tallest card, we will set the rest of the cards to it
    setHeight(Math.max(...[...node.children].map(it => it.getBoundingClientRect().height)))
  }, [])
  const deleteProject = useProjectsStore(s => s.deleteProject)
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedProjectName, setSelectedProjectName] = useState('')
  const [kebabOpen, setKebabOpen] = useState(false)
  const [coordinates, setCoordinates] = useState<Coordinate>({ x: 0, y: 0 })
  const [kebabRefs, setKebabRefs] = useState<Array<RefObject<HTMLAnchorElement>>>()

  // Dynamic styling values for new project thumbnails
  // Will likely be extended to 'Your Projects' list
  // If matching system theme, don't append a theme to css vars
  const theme = preferences.theme === 'system' ? '' : `-${preferences.theme}`
  const stylingVals = {
    stateFill: `var(--state-bg${theme})`,
    strokeColor: `var(--stroke${theme})`
  }

  // Remove old thumbnails
  useEffect(() => {
    if (projects.length) {
      Object.keys(thumbnails).forEach(id => !projects.some(p => p._id === id) && removeThumbnail(id))
    }
  }, [projects, thumbnails])

  // Create and update refs when projects changes
  useEffect(() => {
    setKebabRefs(Array.from({ length: projects.length }, () => createRef<HTMLAnchorElement>()))
  }, [projects])

  const handleNewFile = (type: ProjectType) => {
    setProject(createNewProject(type))
    navigate('/editor')
  }

  const handleLoadProject = (project: StoredProject) => {
    setProject(project)
    navigate('/editor')
  }

  const handleDeleteProject = (pid: string) => {
    deleteProject(pid)
  }

  const importProject = () => {
    // promptLoadFile(setProject, 'The file format provided is not valid. Please only open Automatarium .json or JFLAP .jff file formats.', '.jff,.json', () => navigate('/editor'))
    dispatchCustomEvent('modal:import', null)
  }

  return <Main wide>
    <HeaderRow>
      <Header linkTo="/" />
      <div style={{ flex: 1 }} />
      <ButtonGroup>
        <PreferencesButton title="Preferences" type="button" onClick={() => dispatchCustomEvent('modal:preferences', null)}><Settings /></PreferencesButton>
      </ButtonGroup>
    </HeaderRow>

    <CardList
      title="New Project"
      button={<Button onClick={importProject}>Import...</Button>}
      innerRef={cardsRef}
    >
      <NewProjectCard
        title="Finite State Automaton"
        description="Create a deterministic or non-deterministic automaton with finite states. Capable of representing regular grammars."
        onClick={() => handleNewFile('FSA')}
        height={height}
        image={<FSA {...stylingVals} />}
      />
      <NewProjectCard
        title="Push Down Automaton"
        description="Create an automaton with a push-down stack capable of representing context-free grammars."
        onClick={() => handleNewFile('PDA')}
        height={height}
        image={<PDA {...stylingVals} />}
      />
      <NewProjectCard
        title="Turing Machine"
        description="Create a turing machine capable of representing recursively enumerable grammars."
        onClick={() => handleNewFile('TM')}
        height={height}
        image={<TM {...stylingVals} />}
      />
    </CardList>

    <CardList
      title="Your Projects"
      style={{ gap: '1.5em .4em' }}
    >
      {projects.sort((a, b) => b.meta.dateEdited - a.meta.dateEdited).map((p, i) =>
        <ProjectCard
          key={p._id}
          name={p?.meta?.name ?? '<Untitled>'}
          type={p?.config?.type ?? '???'}
          date={dayjs(p?.meta?.dateEdited)}
          image={thumbnails[p._id]}
          width={PROJECT_THUMBNAIL_WIDTH}
          onClick={() => handleLoadProject(p)}
          $kebabClick={(event) => {
            event.stopPropagation()
            // dispatchCustomEvent('modal:deleteConfirm', null)
            setKebabOpen(true)
            const thisRef = kebabRefs[i] === null
              // Set default values if not done yet to prevent crashes
              ? { offsetLeft: 0, offsetTop: 0, offsetHeight: 0 }
              : kebabRefs[i].current
            const coords = {
              x: thisRef.offsetLeft,
              y: thisRef.offsetTop + thisRef.offsetHeight
            } as Coordinate
            setCoordinates(coords)
            setSelectedProjectId(p._id)
            setSelectedProjectName(p?.meta?.name ?? '<Untitled>')
          }}
          $kebabRef={ kebabRefs === undefined ? null : kebabRefs[i] }
          $istemplate={false}
        />
      )}
      {projects.length === 0 && <NoResultSpan>No projects yet</NoResultSpan>}
    </CardList>

    <KebabMenu
      x={coordinates.x}
      y={coordinates.y}
      isOpen={kebabOpen}
      onClose={() => setKebabOpen(false)}
    />

    <DeleteConfirmationDialog
      projectName={selectedProjectName}
      isOpen={deleteConfirmationVisible}
      isOpenReducer={setDeleteConfirmationVisible}
      onClose={() => setDeleteConfirmationVisible(false)}
      onConfirm={() => {
        handleDeleteProject(selectedProjectId)
        setDeleteConfirmationVisible(false)
      }}
    />

    <ImportDialog navigateFunction={navigate} />
  </Main>
}

export default NewFile
