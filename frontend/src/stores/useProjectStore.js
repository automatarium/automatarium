import create from 'zustand'
import { persist } from 'zustand/middleware'
import produce, { current } from 'immer'
import clone from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'

import { randomProjectName } from '/src/util/projectName'

import {
  APP_VERSION,
  SCHEMA_VERSION,
  DEFAULT_PROJECT_TYPE,
  DEFAULT_STATE_PREFIX,
  DEFAULT_ACCEPTANCE_CRITERIA,
  DEFAULT_PROJECT_COLOR,
} from '/src/config/projects'

export const createNewProject = (projectType = DEFAULT_PROJECT_TYPE) => ({
  // TODO: use project type
  _id: crypto.randomUUID(),
  states: [],
  transitions: [],
  comments: [],
  tests: {
    single: '',
    batch: [''],
  },
  initialState: null,
  meta: {
    name: randomProjectName(),
    dateCreated: new Date().getTime(),
    dateEdited: new Date().getTime(),
    version: SCHEMA_VERSION,
    automatariumVersion: APP_VERSION,
  },
  config: {
    type: projectType,
    statePrefix: DEFAULT_STATE_PREFIX,
    acceptanceCriteria: DEFAULT_ACCEPTANCE_CRITERIA,
    color: DEFAULT_PROJECT_COLOR[projectType],
  }
})

const useProjectStore = create(persist((set, get) => ({
  project: null,
  history: [],
  historyPointer: null,
  lastChangeDate: null,
  lastSaveDate: null,

  set: project => { set({ project, history: [ clone(project) ], historyPointer: 0 })},

  /* Add current project state to stored history of project states */
  commit: () => set(produce(state => {
    // Check whether anything changed before committing
    const didChange = !isEqual(current(state.history[state.historyPointer]), current(state.project))
    if (!didChange)
      return

    // Delete the future
    state.history = state.history.slice(0, state.historyPointer + 1)

    // Add new history
    state.history.push(clone(state.project))

    // Reset pointer
    state.historyPointer = state.history.length - 1

    // Update edited date
    state.lastChangeDate = new Date().getTime()
  })),

  undo: () => set(produce(state => {
    // Can we undo?
    if (state.historyPointer == 0)
      return

    // Move pointer
    state.historyPointer--

    // Update project
    state.project = state.history[state.historyPointer]

    // Update edited date
    state.lastChangeDate = new Date().getTime()
  })),

  redo: () => set(produce(state => {
    // Can we redo?
    if (state.historyPointer == state.history.length - 1)
      return

    // Move pointer
    state.historyPointer++

    // Update project
    state.project = state.history[state.historyPointer]

    // Update edited date
    state.lastChangeDate = new Date().getTime()
  })),

  /* Change the date the project was last saved */
  setLastSaveDate: lastSaveDate => set({ lastSaveDate }),

  /* Change the projects name */
  setName: name => set(s => ({
    project: {...s.project, meta: {...s.project.meta, name }},
    lastChangeDate: new Date().getTime(),
  })),

  /* Create a new transition */
  createTransition: transition => {
    const id = 1 + Math.max(-1, ...get().project.transitions.map(t => t.id))
    set(produce(({ project }) => {
      project.transitions.push({ ...transition, id })
    }))
    return id
  },
  editTransition: (id, read) => set(produce(({ project }) => {
    project.transitions.find(t => t.id === id).read = read
  })),

  /* Create a new comment */
  createComment: comment => set(produce(({ project }) => {
    project.comments.push({ ...comment, id: 1 + Math.max(-1, ...project.comments.map(c => c.id)) })
  })),

  /* Update a comment by id */
  updateComment: comment => set(produce(({ project }) => {
    project.comments = project.comments.map(cm => cm.id === comment.id ? {...cm, ...comment} : cm)
  })),

  /* Remove a commejt by id */
  removeComment: comment => set(produce(({ project }) => {
    project.comments = project.comments.filter(cm => cm.id !== comment.id)
  })),

  /* Create a new state */
  createState: state => set(produce(({ project }) => {
    project.states.push({ isFinal: false, ...state, id: 1 + Math.max(-1, ...project.states.map(s => s.id)) })
  })),

  /* Update a state by id */
  updateState: state => set(produce(({ project }) => {
    project.states = project.states.map(st => st.id === state.id ? {...st, ...state} : st)
  })),

  /* Remove a state by id */
  removeState: state => set(produce(({ project }) => {
    project.states = project.states.filter(st => st.id !== state.id)
  })),

  /* Update tests */
  setSingleTest: value => set(produce((state) => {
    state.project.tests.single = value
    state.lastChangeDate = new Date().getTime()
  })),
  addBatchTest: (value = '') => set(produce((state) => {
    state.project.tests.batch.push(value)
    state.lastChangeDate = new Date().getTime()
  })),
  updateBatchTest: (index, value) => set(produce((state) => {
    state.project.tests.batch[index] = value
    state.lastChangeDate = new Date().getTime()
  })),
  removeBatchTest: index => set(produce((state) => {
    state.project.tests.batch.splice(index, 1)
    state.lastChangeDate = new Date().getTime()
  })),

  /* Set given state to be the initial state */
  setStateInitial: stateID => set(s => ({ project: { ...s.project, initialState: stateID } })),

  /* Set all provided states as final */
  toggleStatesFinal: stateIDs => set(produce(({ project}) => {
    project.states = project.states.map(state => ({ ...state, isFinal: stateIDs.includes(state.id) ? !state.isFinal : state.isFinal}))
  })),

  /* Toggle direction of transitions */
  flipTransitions: transitionIDs => set(produce(({ project }) => {
    project.transitions = project.transitions.map(t => transitionIDs.includes(t.id) ? ({
      ...t,
      from: t.to,
      to: t.from,
    }) : t)
  })),

  /* Remove states by id */
  removeStates: stateIDs => set(produce(({ project }) => {
    // Remove states
    project.states = project.states.filter(st => !stateIDs.includes(st.id))

    // Remove associated transitions
    project.transitions = project.transitions.filter(t => !stateIDs.includes(t.from) && !stateIDs.includes(t.to))
  })),

  /* Remove transitions by id */
  removeTransitions: transitionIDs => set(produce(({ project }) => {
    project.transitions = project.transitions.filter(t => !transitionIDs.includes(t.id))
  })),

  /* Remove comments by id */
  removeComments: commentIDs => set(produce(({ project }) => {
    project.comments = project.comments.filter(c => !commentIDs.includes(c.id))
  })),

  // Change the config
  updateConfig: newConfig => set(produce((state) => {
    state.project.config = { ...state.project.config, ...newConfig }
    state.lastChangeDate = new Date().getTime()
  })),

  reset: () => set({ project: createNewProject(), history: [], historyPointer: null, dateEdited: null })
}), {
  name: 'automatarium-project'
}))

export default useProjectStore
