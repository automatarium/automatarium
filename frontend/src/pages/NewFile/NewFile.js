import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import { Main, Button, Header } from '/src/components'
import { NewProjectCard, ProjectCard, CardList } from './components'
import { useProjectsStore, useProjectStore } from '/src/stores'
import { createNewProject } from '/src/stores/useProjectStore' // #HACK

import { NoResultSpan } from './newFileStyle'

const NewFile = () => {
  const navigate = useNavigate()
  const projects = useProjectsStore(s => s.projects)
  const setProject = useProjectStore(s => s.set)

  const handleNewFile = projectType => {
    setProject(createNewProject(projectType))
    navigate('/editor')
  }

  const handleLoadProject = project => {
    setProject(project)
    navigate('/editor')
  }

  return <Main wide>
    <Header />
    <section>
      <CardList title="New File" scroll>
        <NewProjectCard
          title={'Finite State Automaton'}
          description={'Create a deterministic or non-deterministic automaton with finite states. Capable of representing regular grammars.'}
          onClick={() => handleNewFile('FSA')} />
        <NewProjectCard
          disabled
          title={'Push Down Automaton'}
          description={'Create an automaton with a push-down stack capable of representing context-free grammars.'} />
        <NewProjectCard
          disabled
          title={'Turing Machine'}
          description={'Create a turing machine capable of representing recursively enumerable grammars.'} />
      </CardList>
    </section>
    <section>
      <CardList title="Recent" button={<Button>Open...</Button>}>
        {projects.sort((a, b) => b.meta.dateEdited < a.meta.dateEdited ? -1 : 1).map(p =>
          <ProjectCard
            key={p._id}
            name={p?.meta?.name ?? '<Untitled>'}
            type={p?.config?.type ?? '???'}
            date={dayjs(p?.meta?.dateEdited)}
            onClick={() => handleLoadProject(p)}/>
        )}
        {projects.length === 0 && <NoResultSpan>No projects yet :)</NoResultSpan>}
      </CardList>
    </section>
  </Main>
}

export default NewFile
