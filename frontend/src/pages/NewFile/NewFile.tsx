import dayjs from 'dayjs'
import { Settings } from 'lucide-react'
import { RefObject, createRef, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Header, Main, ProjectCard, ImportDialog } from '/src/components'
import { PROJECT_THUMBNAIL_WIDTH } from '/src/config/rendering'
import { usePreferencesStore, useProjectStore, useProjectsStore, useThumbnailStore, useLabStore, useLabsStore } from '/src/stores'
import { StoredProject, createNewProject } from '/src/stores/useProjectStore' // #HACK
import { dispatchCustomEvent } from '/src/util/events'
import { StoredLab, createNewLab, createNewLabProject,  } from 'src/stores/useLabStore'

import { CardList, DeleteConfirmationDialog, NewProjectCard, LabCard } from './components'
import FSA from './images/FSA'
import PDA from './images/PDA'
import TM from './images/TM'
import { ButtonGroup, HeaderRow, NoResultSpan, PreferencesButton } from './newFileStyle'
import KebabMenu from '/src/components/KebabMenu/KebabMenu'
import { Coordinate, ProjectType } from '/src/types/ProjectTypes'
import NewPageTour from '../Tutorials/guidedTour/NewPageTour'

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
  const [kebabRefsProjects, setKebabRefsProjects] = useState<Array<RefObject<HTMLAnchorElement>>>([])
  const [kebabRefsLabs, setKebabRefsLabs] = useState<Array<RefObject<HTMLAnchorElement>>>([])
  const [kebabRefsLatestLab, setKebabRefsLatestLab] = useState<RefObject<HTMLAnchorElement> | null>(null)

  /// Tour stuff
  const [showTour, setShowTour] = useState(false)
  const closeTour = () => {
    setShowTour(false)
  }

  const handleStep = (step: number) => {
    // Define the behavior when the tour reaches the banner step
    if (step) {
      // setIsBannerStep(true);
      scrollToArea(step)
    }
  }
  const scrollToArea = (step: number) => {
    if (step === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 2) {
      window.scrollTo({ top: 1010, behavior: 'smooth' })
    } else if (step === 3) {
      window.scrollTo({ top: 10, behavior: 'smooth' })
    }
  }

  // Labs
  const labs = useLabsStore(s => s.labs)
  const setLab = useLabStore(s => s.setLab)
  const addLabProject = useLabStore(s => s.upsertProject)
  const getLabProject = useLabStore(s => s.getProject)
  const deleteLab = useLabsStore(s => s.deleteLab)
  const currentLab = useLabStore(s => s.lab)
  const addQuestion = useLabStore(s => s.upsertQuestion)

  // Dynamic styling values for new project thumbnails
  // Will likely be extended to 'Your Projects' list
  // If matching system theme, don't append a theme to css vars
  const theme = preferences.theme === 'system' ? '' : `-${preferences.theme}`
  const getThumbTheme = useCallback((id: string) => {
    const thumbTheme = preferences.theme === 'system'
      ? window.matchMedia && window.matchMedia('prefer-color-scheme: dark').matches ? '-dark' : ''
      : preferences.theme === 'dark' ? '-dark' : ''
    return `${id}${thumbTheme}`
  }, [preferences.theme])
  const stylingVals = {
    stateFill: `var(--state-bg${theme})`,
    strokeColor: `var(--stroke${theme})`
  }

  // Remove old thumbnails
  useEffect(() => {
    if (projects.length) {
      Object.keys(thumbnails).forEach(id => !id.startsWith('tmp') && !projects.some(p => p._id === id || `${p._id}-dark` === id) && removeThumbnail(id))
    }
    const tourShown = localStorage.getItem('tourNewShown')
    if (!tourShown) {
      const timeoutId = setTimeout(() => {
        setShowTour(true)
      }, 1000)
      localStorage.setItem('tourNewShown', 'true')
      return () => clearTimeout(timeoutId)
    }
  }, [projects, thumbnails])

  // Separate refs to avoid kebab menu showing up in the wrong place
  // For "Your Projects Section"
  useEffect(() => {
    setKebabRefsProjects(Array.from({ length: projects.length }, () => createRef<HTMLAnchorElement>()))
  }, [projects])

  // For "Your Labs Section"
  useEffect(() => {
    setKebabRefsLabs(Array.from({ length: labs.length }, () => createRef<HTMLAnchorElement>()))
  }, [labs])

  // For "Your Latest Lab Section"
  useEffect(() => {
    if (currentLab) {
      setKebabRefsLatestLab(createRef<HTMLAnchorElement>())
    }
  }, [currentLab])


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

  const handleNewLabFile = (type: ProjectType ) => {
      // Create a new lab, lab project and question
      const newLab = createNewLab();
      const newLabProject = createNewLabProject(type, newLab.meta.name);
      addQuestion(newLabProject._id, '')

      // Set the new lab and lab project
      setLab(newLab);
      addLabProject(newLabProject);
      
      // Set lab project for editor
      setProject(getLabProject(0))

      // Go to the editor
      navigate('/editor');
  };

  const handleLoadLab = (lab: StoredLab) => {
    setLab(lab)
    setProject(getLabProject(0))
    navigate('/editor')
  };

  const handleDeleteLab = (pid: string) => {
    deleteLab(pid)
    if (currentLab && currentLab._id === pid) {
      setLab(null)
    }
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
          image={thumbnails[getThumbTheme(p._id)]}
          width={PROJECT_THUMBNAIL_WIDTH}
          onClick={() => handleLoadProject(p)}
          $kebabClick={(event) => {
            event.stopPropagation()
            // dispatchCustomEvent('modal:deleteConfirm', null)
            setKebabOpen(true)
            const thisRef = kebabRefsProjects[i] === null
              // Set default values if not done yet to prevent crashes
              ? { offsetLeft: 0, offsetTop: 0, offsetHeight: 0 }
              : kebabRefsProjects[i].current
            const coords = {
              x: thisRef.offsetLeft,
              y: thisRef.offsetTop + thisRef.offsetHeight
            } as Coordinate
            setCoordinates(coords)
            setSelectedProjectId(p._id)
            setSelectedProjectName(p?.meta?.name ?? '<Untitled>')
          }}
          $kebabRef={ kebabRefsProjects === undefined ? null : kebabRefsProjects[i] }
          $istemplate={false}
        />
      )}
      {projects.length === 0 && <NoResultSpan>No projects yet</NoResultSpan>}
    </CardList>

    <CardList
      title="New Lab"
      button={<Button onClick={importProject}>Import...</Button>}
      innerRef={cardsRef}
    >
      <NewProjectCard
        title="Finite State Automaton"
        description=""
        onClick={() => handleNewLabFile('FSA')}
        height={height}
        image={<FSA {...stylingVals} />}
      />
      <NewProjectCard
        title="Push Down Automaton"
        description=""
        onClick={() => handleNewLabFile('PDA')}
        height={height}
        image={<PDA {...stylingVals} />}
      />
      <NewProjectCard
        title="Turing Machine"
        description=""
        onClick={() => handleNewLabFile('TM')}
        height={height}
        image={<TM {...stylingVals} />}
      />
    </CardList>

    {currentLab && (
      // conditional rendering for latest lab. 
      // showing the latest lab if more than one lab is stored and nothing if no
      // labs exist
        <CardList title="Ongoing Lab" style={{ gap: '1.5em .4em' }}>
          <LabCard
            key={currentLab._id}
            name={currentLab?.meta?.name ?? '<Untitled>'}
            image={thumbnails[getThumbTheme(currentLab._id)]}
            width={PROJECT_THUMBNAIL_WIDTH}
            onClick={() => handleLoadLab(currentLab)}
            $kebabClick={(event) => {
              event.stopPropagation();
              setKebabOpen(true);
              const thisRef = kebabRefsLatestLab?.current || { offsetLeft: 0, offsetTop: 0, offsetHeight: 0 }
              const coords = {
                x: thisRef.offsetLeft,
                y: thisRef.offsetTop + thisRef.offsetHeight
              } as Coordinate;
              setCoordinates(coords);
              setSelectedProjectId(currentLab._id); 
              setSelectedProjectName(currentLab.meta.name)
            }}
            $kebabRef={kebabRefsLatestLab}
            $istemplate={false}
          />
        </CardList>
      )}
    
    <CardList
      title="Your Labs"
      style={{ gap: '1.5em .4em' }}
    >
      {
      labs.sort((a,b) => b.meta.dateEdited - a.meta.dateEdited).map((lab, index) => {
      return (
        <LabCard
          key={lab._id}
          name={lab?.meta?.name ?? '<Untitled>'} 
          image={thumbnails[getThumbTheme(lab._id)]}
          width={PROJECT_THUMBNAIL_WIDTH}
          onClick={() => handleLoadLab(lab)}  
          $kebabClick={(event) => {
            event.stopPropagation();
            setKebabOpen(true);
            const thisRef = kebabRefsLabs[index]?.current || { offsetLeft: 0, offsetTop: 0, offsetHeight: 0 }
            const coords = {
              x: thisRef.offsetLeft,
              y: thisRef.offsetTop + thisRef.offsetHeight
            } as Coordinate;
            setCoordinates(coords);
            setSelectedProjectId(lab._id); 
            setSelectedProjectName(currentLab.meta.name);
          }}
          $kebabRef={kebabRefsLabs?.[index] ?? null}
          $istemplate={false}
        />
      );
    })}
    {labs.length === 0 && <NoResultSpan>No labs yet</NoResultSpan>}
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
        handleDeleteLab(selectedProjectId)
        setDeleteConfirmationVisible(false)
      }}
    />

    {showTour && <NewPageTour onClose={closeTour} Step={handleStep} />}
    <ImportDialog navigateFunction={navigate} />
  </Main>
}

export default NewFile
