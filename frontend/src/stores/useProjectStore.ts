import create, { SetState, GetState } from 'zustand'
import { persist } from 'zustand/middleware'
import produce, { current } from 'immer'
import clone from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'

import { randomProjectName } from '../util/projectName'

import {
  Project,
  AutomataTransition,
  AutomataState,
  ProjectConfig,
  ProjectComment,
  ProjectType
} from '../types/ProjectTypes'

import {
  APP_VERSION,
  SCHEMA_VERSION,
  DEFAULT_STATE_PREFIX,
  DEFAULT_PROJECT_TYPE,
  DEFAULT_ACCEPTANCE_CRITERIA,
  DEFAULT_PROJECT_COLOR
} from '../config/projects'

export const createNewProject = (projectType: ProjectType = DEFAULT_PROJECT_TYPE): Project => ({
  projectType,
  _id: crypto.randomUUID(),
  states: [],
  transitions: [],
  comments: [],
  simResult: [],
  tests: {
    single: '',
    batch: ['']
  },
  initialState: null,
  meta: {
    name: randomProjectName(),
    dateCreated: new Date().getTime(),
    dateEdited: new Date().getTime(),
    version: SCHEMA_VERSION,
    automatariumVersion: APP_VERSION
  },
  config: {
    type: projectType,
    statePrefix: DEFAULT_STATE_PREFIX,
    acceptanceCriteria: DEFAULT_ACCEPTANCE_CRITERIA,
    color: DEFAULT_PROJECT_COLOR[projectType]
  }
})

interface ProjectStore {
  project: Project,
  // Can't work this one out
  history: Project[],
  historyPointer: number,
  lastChangeDate: number,
  lastSaveDate: number,
  set: (project: Project) => void,
  commit: () => void,
  undo: () => void,
  redo: () => void,
  setLastSaveDate: (lastSaveDate: number) => void,
  setName: (name: string) => void,
  createTransition: (transition: AutomataTransition) => number,
  editTransition: (transition: AutomataTransition) => void,
  createComment: (comment: ProjectComment) => void,
  updateComment: (comment: ProjectComment) => void,
  removeComment: (comment: ProjectComment) => void,
  createState: (state: AutomataState) => void,
  updateState: (state: AutomataState) => void,
  removeState: (state: AutomataState) => void,
  // still not sure what's going on with the tests
  setSingleTest: (value: string) => void,
  addBatchTest: (value: string) => void,
  updateBatchTest: (index: number, value: string) => void,
  removeBatchTest: (index: number) => void,
  setStateInitial: (stateID: number) => void,
  // not sure if arrays
  toggleStatesFinal: (stateIDs: number[]) => void,
  flipTransitions: (transitionIDs: number[]) => void,
  removeStates: (stateIDs: number[]) => void,
  removeTransitions: (transitionIDs: number[]) => void,
  removeComments: (commentIDs: number[]) => void,
  updateConfig: (newConfig: ProjectConfig) => void,
  reset: () => void,
}

const useProjectStore = create<ProjectStore>(persist((set: SetState<ProjectStore>, get: GetState<ProjectStore>) => ({
  // Need to refactor to do this in a better way
  project: {} as Project,
  history: [],
  // yucky initial vals for numbers also need to refactor later on
  historyPointer: 0,
  lastChangeDate: -1,
  lastSaveDate: -1,

  set: (project: Project) => { set({ project, history: [clone(project)], historyPointer: 0 }) },

  /* Add current project state to stored history of project states */
  commit: () => set(produce((state: ProjectStore) => {
    // Check whether anything changed before committing
    const didChange = !isEqual(current(state.history[state.historyPointer]), current(state.project))
    if (!didChange) { return }

    // Delete the future
    state.history = state.history.slice(0, state.historyPointer + 1)

    // Add new history
    state.history.push(clone(state.project))

    // Reset pointer
    state.historyPointer = state.history.length - 1

    // Update edited date
    state.lastChangeDate = new Date().getTime()
  })),

  undo: () => set(produce((state: ProjectStore) => {
    // Can we undo?
    if (state.historyPointer === 0) { return }
    // Move pointer
    state.historyPointer--

    // Update project
    state.project = state.history[state.historyPointer]

    // Update edited date
    state.lastChangeDate = new Date().getTime()
  })),

  redo: () => set(produce((state: ProjectStore) => {
    // Can we redo?
    if (state.historyPointer === state.history.length - 1) { return }

    // Move pointer
    state.historyPointer++

    // Update project
    state.project = state.history[state.historyPointer]

    // Update edited date
    state.lastChangeDate = new Date().getTime()
  })),

  /* Change the date the project was last saved */
  setLastSaveDate: (lastSaveDate: number) => set({ lastSaveDate }),

  /* Change the projects name */
  setName: (name: string) => set((s: ProjectStore) => ({
    project: { ...s.project, meta: { ...s.project.meta, name } },
    lastChangeDate: new Date().getTime()
  })),

  /* Create a new transition */
  createTransition: (transition: AutomataTransition) => {
    const id = 1 + Math.max(-1, ...get().project.transitions.map(t => t.id))
    set(produce(({ project }) => {
      project.transitions.push({ ...transition, id })
    }))
    return id
  },

  editTransition: (newTransition: AutomataTransition) => set(produce(({ project }: { project: Project }) => {
    // Refactor types to enums later
    if (project.config.type === 'TM') {
      project.transitions.find((t: AutomataTransition) => t.id === newTransition.id).write = newTransition.write
      project.transitions.find((t: AutomataTransition) => t.id === newTransition.id).read = newTransition.read
      project.transitions.find((t: AutomataTransition) => t.id === newTransition.id).direction = newTransition.direction
    } else if (project.config.type === 'PDA') {
      project.transitions.find((t: AutomataTransition) => t.id === newTransition.id).pop = newTransition.pop
      project.transitions.find((t: AutomataTransition) => t.id === newTransition.id).push = newTransition.push
    }
    project.transitions.find((t: AutomataTransition) => t.id === newTransition.id).read = newTransition.read
  })),

  /* Create a new comment */
  createComment: (comment: ProjectComment) => set(produce(({ project }: { project: Project }) => {
    project.comments.push({ ...comment, id: 1 + Math.max(-1, ...project.comments.map((c: ProjectComment) => c.id)) })
  })),

  /* Update a comment by id */
  updateComment: (comment: ProjectComment) => set(produce(({ project }: { project: Project }) => {
    project.comments = project.comments.map((cm: ProjectComment) => cm.id === comment.id ? { ...cm, ...comment } : cm)
  })),

  /* Remove a comment by id */
  removeComment: (comment: ProjectComment) => set(produce(({ project }: { project: Project }) => {
    project.comments = project.comments.filter((cm: ProjectComment) => cm.id !== comment.id)
  })),

  /* Create a new state */
  createState: (state: AutomataState) => set(produce(({ project }: { project: Project }) => {
    state.isFinal = false
    project.states.push({ ...state, id: 1 + Math.max(-1, ...project.states.map(s => s.id)) })
  })),

  /* Update a state by id */
  updateState: (state: AutomataState) => set(produce(({ project }: { project: Project }) => {
    project.states = project.states.map((st: AutomataState) => st.id === state.id ? { ...st, ...state } : st)
  })),

  /* Remove a state by id */
  removeState: (state: AutomataState) => set(produce(({ project }: { project: Project }) => {
    project.states = project.states.filter((st: AutomataState) => st.id !== state.id)
  })),

  /* Update tests */
  setSingleTest: (value: string) => set(produce((state: ProjectStore) => {
    state.project.tests.single = value
    state.lastChangeDate = new Date().getTime()
  })),

  addBatchTest: (value: string) => set(produce((state: ProjectStore) => {
    value = value ?? ''
    state.project.tests.batch.push(value)
    state.lastChangeDate = new Date().getTime()
  })),

  updateBatchTest: (index: number, value: string) => set(produce((state: ProjectStore) => {
    state.project.tests.batch[index] = value
    state.lastChangeDate = new Date().getTime()
  })),

  removeBatchTest: index => set(produce((state: ProjectStore) => {
    state.project.tests.batch.splice(index, 1)
    state.lastChangeDate = new Date().getTime()
  })),

  /* Set given state to be the initial state */
  setStateInitial: (stateID: number) => set((s: ProjectStore) => ({ project: { ...s.project, initialState: stateID } })),

  /* Set all provided states as final */
  toggleStatesFinal: (stateIDs: number[]) => set(produce(({ project }: {project: Project}) => {
    project.states = project.states.map(state => ({ ...state, isFinal: stateIDs.includes(state.id) ? !state.isFinal : state.isFinal }))
  })),

  /* Toggle direction of transitions */
  flipTransitions: (transitionIDs: number[]) => set(produce(({ project }: {project: Project}) => {
    project.transitions = project.transitions.map(t => transitionIDs.includes(t.id)
      ? ({
          ...t,
          from: t.to,
          to: t.from
        })
      : t)
  })),

  /* Remove states by id */
  removeStates: (stateIDs: number[]) => set(produce(({ project }: {project: Project}) => {
    // Remove states
    project.states = project.states.filter((st: AutomataState) => !stateIDs.includes(st.id))

    // Remove associated transitions
    project.transitions = project.transitions.filter((t: AutomataTransition) => !stateIDs.includes(t.from) && !stateIDs.includes(t.to))
  })),

  /* Remove transitions by id */
  removeTransitions: (transitionIDs: number[]) => set(produce(({ project }: {project: Project}) => {
    project.transitions = project.transitions.filter((t: AutomataTransition) => !transitionIDs.includes(t.id))
  })),

  /* Remove comments by id */
  removeComments: (commentIDs: number[]) => set(produce(({ project }: {project: Project}) => {
    project.comments = project.comments.filter(c => !commentIDs.includes(c.id))
  })),

  // Change the config
  updateConfig: (newConfig: ProjectConfig) => set(produce((state: ProjectStore) => {
    state.project.config = { ...state.project.config, ...newConfig }
    state.lastChangeDate = new Date().getTime()
  })),

  reset: () => set({ project: createNewProject(), history: [], historyPointer: 0, lastChangeDate: -1, lastSaveDate: -1 })
}), {
  name: 'automatarium-project'
}))

export default useProjectStore
