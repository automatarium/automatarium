import create from 'zustand'
import produce, { current} from 'immer'
import { v4 as uuid } from 'uuid'
import clone from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'

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
    name: 'q0',
    label: null,
    x: 150,
    y: 150,
    isFinal: false,
  }, {
    id: 1,
    name: 'q1',
    label: null,
    x: 330,
    y: 170,
    isFinal: false,
  },{
    id: 2,
    name: 'q2',
    label: null,
    x: 150,
    y: 350,
    isFinal: false,
  }, {
    id: 3,
    name: 'q3',
    label: null,
    x: 530,
    y: 350,
    isFinal: true,
  }],
  transitions: [{
    from: 0,
    to: 1,
    read: 'a',
  }, {
    from: 1,
    to: 2,
    read: 'z',
  },{
    from: 2,
    to: 3,
    read: 'a'
  }, {
    from: 2,
    to: 3,
    read: 'b'
  }, {
    from: 2,
    to: 3,
    read: 'c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t',
  }]
}

export const createNewProject = () => ({
    id: uuid(),
    states: sampleInitialData.states,
    transitions: sampleInitialData.transitions,
    comments: [],
    tests: [],
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

  /* Create a new state */
  createState: state => set(produce(({ project }) => {
    project.states.push({ ...state, id: project.state.length })
  })),

  /* Update a state by id */
  updateState: state => set(produce(({ project }) => {
    project.states = project.states.map(st => st.id === state.id ? {...st, ...state} : st)
  })),

  /* Remove a state by id */
  removeState: state => set(produce(({ project }) => {
    project.states = project.states.filter(st => st.id !== state.id)    
  })),

  reset: () => set({ project: createNewProject() })
}))

export default useProjectStore 
