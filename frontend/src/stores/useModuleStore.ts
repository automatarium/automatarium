import { create, SetState, GetState } from 'zustand'
import { persist } from 'zustand/middleware'
import { randomProjectName } from '../util/projectName'
import {
  Project,
  ProjectType
} from '../types/ProjectTypes'
import {
  APP_VERSION,
  SCHEMA_VERSION,
  DEFAULT_STATE_PREFIX,
  DEFAULT_OR_OPERATOR,
  DEFAULT_PROJECT_TYPE,
  DEFAULT_ACCEPTANCE_CRITERIA
} from '/src/config'

export type ModuleProject = Project & { _id: string }

export const createNewModuleProject = (
  projectType: ProjectType = DEFAULT_PROJECT_TYPE,
  projectName: string = randomProjectName()
): ModuleProject => ({
  projectType,
  _id: crypto.randomUUID(),
  states: [],
  transitions: [],
  comments: [],
  simResult: [],
  tests: { single: '', batch: [''] },
  initialState: null,
  meta: {
    name: projectName,
    dateCreated: new Date().getTime(),
    dateEdited: new Date().getTime(),
    version: SCHEMA_VERSION,
    automatariumVersion: APP_VERSION
  },
  config: {
    type: projectType,
    statePrefix: DEFAULT_STATE_PREFIX,
    orOperator: DEFAULT_OR_OPERATOR,
    acceptanceCriteria: DEFAULT_ACCEPTANCE_CRITERIA,
    color: 'pink'
  }
})

export interface ModuleMetaData {
  automatariumVersion: string
  dateCreated: number
  dateEdited: number
  name: string
  version: string
}

type ModuleQuestionsDict = Record<string, string>

export type StoredModule = {
  _id: string
  description: string
  projects: ModuleProject[]
  questions: ModuleQuestionsDict
  meta: ModuleMetaData
}

export const createNewModule = (description = 'Write a description here'): StoredModule => ({
  _id: crypto.randomUUID(),
  description,
  projects: [],
  questions: {},
  meta: {
    name: randomProjectName(),
    dateCreated: new Date().getTime(),
    dateEdited: new Date().getTime(),
    version: SCHEMA_VERSION,
    automatariumVersion: APP_VERSION
  }
})

interface ModuleStore {
  module: StoredModule | null
  lastChangeDate: number
  showModuleWindow: boolean
  setModule: (module: StoredModule) => void
  setProjects: (projects: ModuleProject[]) => void
  clearProjects: () => void
  upsertProject: (project: ModuleProject) => void
  deleteProject: (pid: string) => void
  getProject: (index: number) => ModuleProject | undefined
  getProjectById: (id: string) => ModuleProject | undefined
  setName: (name: string) => void
  setShowModuleWindow: (show: boolean) => void
  setModuleDescription: (description: string) => void
  upsertQuestion: (pid: string, question: string) => void
  deleteQuestion: (pid: string) => void
  setAllProjectNames: (name: string) => void
}

const useModuleStore = create<ModuleStore>()(
  persist(
    (set: SetState<ModuleStore>, get: GetState<ModuleStore>) => ({
      module: null as StoredModule,
      showModuleWindow: false,
      lastChangeDate: null,

      setModule: (module: StoredModule) => set({ module }),
      setProjects: (projects) =>
        set((state) => ({ module: { ...state.module, projects } })),
      clearProjects: () =>
        set((state) => ({ module: { ...state.module, projects: [] } })),

      upsertProject: (project) =>
        set((state) => ({
          module: {
            ...state.module,
            projects: state.module?.projects.find((p) => p._id === project._id)
              ? state.module.projects.map((p) =>
                  p._id === project._id ? project : p
                )
              : [...state.module.projects, project]
          }
        })),

      deleteProject: (pid) =>
        set((state) => ({
          module: {
            ...state.module,
            projects: state.module?.projects.filter((p) => p._id !== pid)
          }
        })),

      getProject: (index) => get().module?.projects[index] || undefined,
      getProjectById: (id) =>
        get().module?.projects.find((p) => p._id === id) || undefined,

      setName: (name) =>
        set((s) => ({
          module: { ...s.module, meta: { ...s.module.meta, name } },
          lastChangeDate: new Date().getTime()
        })),

      setModuleDescription: (description) =>
        set((state) => ({
          module: { ...state.module, description },
          lastChangeDate: new Date().getTime()
        })),

      setAllProjectNames: (name) =>
        set((state) => ({
          module: {
            ...state.module,
            projects: state.module?.projects.map((p) => ({
              ...p,
              meta: { ...p.meta, name }
            }))
          },
          lastChangeDate: new Date().getTime()
        })),

      setShowModuleWindow: (show) => set(() => ({ showModuleWindow: show })),

      upsertQuestion: (pid, question) =>
        set((state) => ({
          module: {
            ...state.module,
            questions: { ...state.module.questions, [pid]: question }
          },
          lastChangeDate: new Date().getTime()
        })),

      deleteQuestion: (pid) =>
        set((state) => ({
          module: {
            ...state.module,
            questions: Object.fromEntries(
              Object.entries(state.module?.questions || {}).filter(
                ([key]) => key !== pid
              )
            )
          },
          lastChangeDate: new Date().getTime()
        }))
    }),
    { name: 'automatarium-module' }
  )
)

export default useModuleStore
