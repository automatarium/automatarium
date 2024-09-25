import dayjs from 'dayjs'
import { Settings } from 'lucide-react'
import { RefObject, createRef, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Header, Main, ProjectCard, ImportDialog } from '/src/components'
import { PROJECT_THUMBNAIL_WIDTH } from '/src/config/rendering'
import { usePreferencesStore, useProjectStore, useProjectsStore, useThumbnailStore, useModuleStore, useModulesStore } from '/src/stores'
import { StoredProject, createNewProject } from '/src/stores/useProjectStore' // #HACK
import { dispatchCustomEvent } from '/src/util/events'
import { StoredModule, createNewModule, createNewModuleProject,  } from 'src/stores/useModuleStore'

import { CardList, DeleteConfirmationDialog, NewProjectCard, ModuleCard } from './components'
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

  // Modules
  const modules = useModulesStore(s => s.modules)
  const setModule = useModuleStore(s => s.setModule)
  const addModuleProject = useModuleStore(s => s.upsertProject)
  const getModuleProject = useModuleStore(s => s.getProject)
  const deleteModule = useModulesStore(s => s.deleteModule)
  const currentModule = useModuleStore(s => s.module)
  const addQuestion = useModuleStore(s => s.upsertQuestion)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)
  const addModule = useModulesStore(s => s.upsertModule)

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

  // For "Your modules Section"
  useEffect(() => {
    setKebabRefsLabs(Array.from({ length: modules.length }, () => createRef<HTMLAnchorElement>()))
  }, [modules])

  // For "Your Latest module Section"
  useEffect(() => {
    if (currentModule) {
      setKebabRefsLatestLab(createRef<HTMLAnchorElement>())
    }
  }, [currentModule])


  const handleNewFile = (type: ProjectType) => {
    setShowModuleWindow(false)
    setProject(createNewProject(type))
    navigate('/editor')
  }

  const handleLoadProject = (project: StoredProject) => {
    setShowModuleWindow(false)
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

  const handleNewModuleFile = (type: ProjectType ) => {
      // Create a new module and module project 
      const newModule = createNewModule();
      const newModuleProject = createNewModuleProject(type, newModule.meta.name);

      // Set the new module and module project
      setModule(newModule);
      addModuleProject(newModuleProject);

      // Add question to module
      addQuestion(newModuleProject._id, '')

      // Store module to local storage under automatarium-modules
      addModule(newModule)
      
      // Set module project for editor
      setProject(getModuleProject(0))

      // Show module window when navigating to editor
      if (showModuleWindow === false) {
        setShowModuleWindow(true)
      }

      // Go to the editor
      navigate('/editor');
  };

  const handleLoadModule = (module: StoredModule) => {
    setModule(module)
    setProject(getModuleProject(0))
    if (showModuleWindow === false) {
      setShowModuleWindow(true)
    }
    navigate('/editor')
  };

  const handleDeleteModule = (pid: string) => {
    deleteModule(pid)
    if (currentModule && currentModule._id === pid) {
      setModule(null)
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
      title="New Module"
      button={<Button onClick={importProject}>Import...</Button>}
      innerRef={cardsRef}
    >
      <NewProjectCard
        title="Finite State Automaton"
        description=""
        onClick={() => handleNewModuleFile('FSA')}
        height={height}
        image={<FSA {...stylingVals} />}
      />
      <NewProjectCard
        title="Push Down Automaton"
        description=""
        onClick={() => handleNewModuleFile('PDA')}
        height={height}
        image={<PDA {...stylingVals} />}
      />
      <NewProjectCard
        title="Turing Machine"
        description=""
        onClick={() => handleNewModuleFile('TM')}
        height={height}
        image={<TM {...stylingVals} />}
      />
    </CardList>

    {currentModule && (
      // conditional rendering for latest module. 
      // showing the latest module if more than one module is stored and nothing if no
      // modules exist
        <CardList title="Ongoing Module" style={{ gap: '1.5em .4em' }}>
          <ModuleCard
            key={currentModule._id}
            name={currentModule?.meta?.name ?? '<Untitled>'}
            image={thumbnails[getThumbTheme(currentModule._id)]}
            width={PROJECT_THUMBNAIL_WIDTH}
            onClick={() => handleLoadModule(currentModule)}
            $kebabClick={(event) => {
              event.stopPropagation();
              setKebabOpen(true);
              const thisRef = kebabRefsLatestLab?.current || { offsetLeft: 0, offsetTop: 0, offsetHeight: 0 }
              const coords = {
                x: thisRef.offsetLeft,
                y: thisRef.offsetTop + thisRef.offsetHeight
              } as Coordinate;
              setCoordinates(coords);
              setSelectedProjectId(currentModule._id); 
              setSelectedProjectName(currentModule.meta.name)
            }}
            $kebabRef={kebabRefsLatestLab}
            $istemplate={false}
          />
        </CardList>
      )}
    
    <CardList
      title="Your Modules"
      style={{ gap: '1.5em .4em' }}
    >
      {
      modules.sort((a,b) => b.meta.dateEdited - a.meta.dateEdited).map((module, index) => {
      return (
        <ModuleCard
          key={module._id}
          name={module?.meta?.name ?? '<Untitled>'} 
          image={thumbnails[getThumbTheme(module._id)]}
          width={PROJECT_THUMBNAIL_WIDTH}
          onClick={() => handleLoadModule(module)}  
          $kebabClick={(event) => {
            event.stopPropagation();
            setKebabOpen(true);
            const thisRef = kebabRefsLabs[index]?.current || { offsetLeft: 0, offsetTop: 0, offsetHeight: 0 }
            const coords = {
              x: thisRef.offsetLeft,
              y: thisRef.offsetTop + thisRef.offsetHeight
            } as Coordinate;
            setCoordinates(coords);
            setSelectedProjectId(module._id); 
            setSelectedProjectName(currentModule.meta.name);
          }}
          $kebabRef={kebabRefsLabs?.[index] ?? null}
          $istemplate={false}
        />
      );
    })}
    {modules.length === 0 && <NoResultSpan>No modules yet</NoResultSpan>}
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
        handleDeleteModule(selectedProjectId)
        setDeleteConfirmationVisible(false)
      }}
    />

    {showTour && <NewPageTour onClose={closeTour} Step={handleStep} />}
    <ImportDialog navigateFunction={navigate} />
  </Main>
}

export default NewFile
