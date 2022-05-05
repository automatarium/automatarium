import create from 'zustand'
import produce, { current} from 'immer'
import { v4 as uuid } from 'uuid'
import clone from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'

import { useSelectionStore } from '/src/stores'

import {
  APP_VERSION,
  SCHEMA_VERSION,
  DEFAULT_PROJECT_TYPE,
  DEFAULT_STATE_PREFIX,
  DEFAULT_ACCEPTANCE_CRITERIA,
  DEFAULT_PROJECT_COLOR,
  DEFAULT_PLAYBACK_INTERVAL,
} from '/src/config/projects'

const sampleInitialData = {
  initialState: 0,
  states: [{
    id: 0, //TODO: can be int?
    label: null,
    x: 150,
    y: 150,
    isFinal: false,
  }, {
    id: 1,
    label: null,
    x: 330,
    y: 150,
    isFinal: false,
  },{
    id: 2,
    label: null,
    x: 150,
    y: 350,
    isFinal: false,
  }, {
    id: 3,
    label: null,
    x: 550,
    y: 350,
    isFinal: true,
  }],
  transitions: [{
    id: 0,
    from: 0,
    to: 1,
    read: 'a',
  }, {
    id: 1,
    from: 1,
    to: 2,
    read: 'z',
  },{
    id: 2,
    from: 2,
    to: 3,
    read: 'a'
  }, {
    id: 3,
    from: 2,
    to: 3,
    read: 'b[c-t]',
  }]
}

export const createNewProject = () => ({
  id: uuid(),
  states: sampleInitialData.states,
  transitions: sampleInitialData.transitions,
  comments: [],
  tests: {
    single: '',
    batch: [''],
  },
  initialState: sampleInitialData.initialState,
  meta: {
    name: null,
    dateCreated: new Date(),
    dateEdited: new Date(),
    version: SCHEMA_VERSION,
    automatariumVersion: APP_VERSION,
  },
  config: {
    type: DEFAULT_PROJECT_TYPE,
    statePrefix: DEFAULT_STATE_PREFIX,
    acceptanceCriteria: DEFAULT_ACCEPTANCE_CRITERIA,
    color: DEFAULT_PROJECT_COLOR,
    playbackInterval: DEFAULT_PLAYBACK_INTERVAL,
  }
})

const useProjectStore = create(set => ({
  project: null,
  history: [],
  historyPointer: null,
  
  set: project => set({ project, history: [ clone(project) ], historyPointer: 0 }),

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
  })),

  undo: () => set(produce(state => {
    // Can we undo?
    if (state.historyPointer == 0)
      return

    // Move pointer
    state.historyPointer--

    // Update project
    state.project = state.history[state.historyPointer]
  })),

  redo: () => set(produce(state => {
    // Can we redo?
    if (state.historyPointer == state.history.length - 1)
      return

    // Move pointer
    state.historyPointer++

    // Update project
    state.project = state.history[state.historyPointer]
  })),

  /* Create a new transition */
  createTransition: transition => set(produce(({ project }) => {
    project.transitions.push({ ...transition, id: 1 + Math.max(-1, ...project.transitions.map(t => t.id)) })
  })),

  /* Create a new state */
  createState: state => set(produce(({ project }) => {
    project.states.push({ ...state, id: 1 + Math.max(-1, ...project.states.map(s => s.id)) })
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
  setSingleTest: value => set(produce(({ project }) => {
    project.tests.single = value
  })),
  addBatchTest: () => set(produce(({ project }) => {
    project.tests.batch.push('')
  })),
  setBatchTest: (index, value) => set(produce(({ project }) => {
    project.tests.batch[index] = value
  })),
  removeBatchTest: index => set(produce(({ project }) => {
    project.tests.batch.splice(index, 1)
  })),

  /* Set given state to be the initial state */
  setStateInitial: stateID => set(s => ({ project: { ...s.project, initialState: stateID } })),

  /* Set all provided states as final */
  toggleStatesFinal: stateIDs => set(produce(({ project}) => {
    project.states = project.states.map(state => ({ ...state, isFinal: stateIDs.includes(state.id) ? !state.isFinal : state.isFinal}))
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

  reset: () => set({ project: createNewProject() })
}))

export default useProjectStore
