import { create, SetState, GetState } from 'zustand'
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
  ProjectType,
  Template,
  CopyData
} from '../types/ProjectTypes'

import {
  APP_VERSION,
  SCHEMA_VERSION,
  DEFAULT_STATE_PREFIX,
  DEFAULT_PROJECT_TYPE,
  DEFAULT_ACCEPTANCE_CRITERIA,
  DEFAULT_PROJECT_COLOR
} from '../config/projects'

import { PASTE_POSITION_OFFSET } from 'frontend/src/config/rendering.js'

/**
 * A stored project has an extra `_id` field which is used to tell identify it
 */
export type StoredProject = Project & {_id: string}

export enum InsertGroupResponseType {
  // eslint-disable-next-line no-unused-vars
  FAIL = 1,
  // eslint-disable-next-line no-unused-vars
  SUCCESS
}

type InsertGroupResponse = {
  type: InsertGroupResponseType.FAIL,
  body: string
} | {
  type: InsertGroupResponseType.SUCCESS,
  body: Template | CopyData
}

export const createNewProject = (projectType: ProjectType = DEFAULT_PROJECT_TYPE): StoredProject => ({
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
  project: StoredProject,
  // Can't work this one out
  history: StoredProject[],
  historyPointer: number,
  lastChangeDate: number,
  lastSaveDate: number,
  set: (project: Project) => void,
  /**
   * Updates the current project. This doesn't reset the history like `set`
   * @param project
   */
  update: (project: StoredProject) => void,
  commit: () => void,
  undo: () => void,
  redo: () => void,
  setLastSaveDate: (lastSaveDate: number) => void,
  setName: (name: string) => void,
  createTransition: (transition: AutomataTransition) => number,
  editTransition: (transition: Partial<AutomataTransition>) => void,
  createComment: (comment: ProjectComment) => number,
  updateComment: (comment: ProjectComment) => void,
  removeComment: (comment: ProjectComment) => void,
  createState: (state: AutomataState) => number,
  updateState: (state: AutomataState) => void,
  removeState: (state: AutomataState) => void,
  insertGroup: (createData: Template | CopyData) => InsertGroupResponse,
  setSingleTest: (value: string) => void,
  addBatchTest: (value: string) => void,
  updateBatchTest: (index: number, value: string) => void,
  removeBatchTest: (index: number) => void,
  setStateInitial: (stateID: number) => void,
  toggleStatesFinal: (stateIDs: number[]) => void,
  flipTransitions: (transitionIDs: number[]) => void,
  removeStates: (stateIDs: number[]) => void,
  removeTransitions: (transitionIDs: number[]) => void,
  removeComments: (commentIDs: number[]) => void,
  updateConfig: (newConfig: ProjectConfig) => void,
  reset: () => void
}

const useProjectStore = create<ProjectStore>()(persist((set: SetState<ProjectStore>, get: GetState<ProjectStore>) => ({
  project: null as StoredProject,
  history: [],
  historyPointer: null,
  lastChangeDate: null,
  lastSaveDate: null,

  set: (project: StoredProject) => { set({ project, history: [clone(project)], historyPointer: 0 }) },

  update: (project: StoredProject) => set(produce((state: ProjectStore) => {
    state.project = project
  })),

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

  editTransition: (newTransition: Partial<AutomataTransition>) => set(produce(({ project }: { project: StoredProject }) => {
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
  createComment: (comment: ProjectComment) => {
    const id = 1 + Math.max(-1, ...get().project.comments.map((c: ProjectComment) => c.id))
    set(produce(({ project }: { project: StoredProject }) => {
      project.comments.push({ ...comment, id })
    }))
    return id
  },

  /* Update a comment by id */
  updateComment: (comment: ProjectComment) => set(produce(({ project }: { project: StoredProject }) => {
    project.comments = project.comments.map((cm: ProjectComment) => cm.id === comment.id ? { ...cm, ...comment } : cm)
  })),

  /* Remove a comment by id */
  removeComment: (comment: ProjectComment) => set(produce(({ project }: { project: StoredProject }) => {
    project.comments = project.comments.filter((cm: ProjectComment) => cm.id !== comment.id)
  })),

  /* Create a new state */
  createState: (state: AutomataState) => {
    const id = 1 + Math.max(-1, ...get().project.states.map(s => s.id))
    set(produce(({ project }: { project: StoredProject }) => {
      state.isFinal = state.isFinal ?? false
      project.states.push({ ...state, id })
    }))
    return id
  },

  /* Update a state by id */
  updateState: (state: AutomataState) => set(produce(({ project }: { project: StoredProject }) => {
    project.states = project.states.map((st: AutomataState) => st.id === state.id ? { ...st, ...state } : st)
  })),

  /* Remove a state by id */
  removeState: (state: AutomataState) => set(produce(({ project }: { project: StoredProject }) => {
    project.states = project.states.filter((st: AutomataState) => st.id !== state.id)
  })),

  insertGroup: (createData) => {
    // Check that we are inserting into same project type
    if (createData.projectType !== get().project.projectType) {
      return { type: InsertGroupResponseType.FAIL, body: `Error: you cannot insert elements from a ${createData.projectType} project into a ${get().project.projectType} project.` }
    }
    // Check that for transitions being inserted, to and from states are also inserted
    let missingState = false
    createData.transitions.forEach((transition) => {
      let toFound = false
      let fromFound = false
      createData.states.forEach((state) => {
        if (state.id === transition.from) {
          fromFound = true
        }
        if (state.id === transition.to) {
          toFound = true
        }
      })
      // If a transition has to or from missing, flag to return error
      if (!(toFound && fromFound)) {
        missingState = true
      }
    })
    if (missingState) {
      return { type: InsertGroupResponseType.FAIL, body: 'Sorry, there was an error.' }
    }
    set(produce(({ project }: { project: StoredProject }) => {
      let isInitialStateUpdated = false
      const isNewProject = createData.projectSource !== project._id
      const newTransitions = structuredClone(createData.transitions)
      newTransitions.forEach(transition => {
        transition.from = null
        transition.to = null
      })
      createData.states.forEach((state, i) => {
        // TODO: ensure position isn't out of window
        // Probably will have to take adjusting position out of this function
        [ state.x, state.y ] = [ state.x + PASTE_POSITION_OFFSET, state.y + PASTE_POSITION_OFFSET ]
        const newId = i + 1 + Math.max(-1, ...get().project.states.map(s => s.id))
        // Update transitions to new state id
        createData.transitions.forEach((transition, i) => {
          if (transition.from === state.id && newTransitions[i].from === null) {
            newTransitions[i].from = newId
          }
          if (transition.to === state.id && newTransitions[i].to === null) {
            newTransitions[i].to = newId
          }
        })
        // Update initial state id if applicable
        if (createData.initialStateId === state.id && !isInitialStateUpdated) {
          createData.initialStateId = newId
          isInitialStateUpdated = true
        }
        state.id = newId
        // createState
        project.states.push({ ...state })
      })
      createData.transitions = newTransitions
      createData.comments.forEach((comment, i) => {
        // TODO: ensure position isn't out of window
        [ comment.x, comment.y ] = [ comment.x + PASTE_POSITION_OFFSET, comment.y + PASTE_POSITION_OFFSET ]
        const newId = i + 1 + Math.max(-1, ...get().project.comments.map((c: ProjectComment) => c.id))
        comment.id = newId
        // createComment
        project.comments.push({ ...comment })
      })
      createData.transitions.forEach((transition, i) => {
        const newId = i + 1 + Math.max(-1, ...get().project.transitions.map(t => t.id))
        transition.id = newId
        // createTransition
        project.transitions.push({ ...transition })
      })
      if (isNewProject && createData.initialStateId !== null && project.initialState === null) {
        project.initialState = createData.initialStateId
      }
    }))
    return { type: InsertGroupResponseType.SUCCESS, body: createData }
  },

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
  toggleStatesFinal: (stateIDs: number[]) => set(produce(({ project }: {project: StoredProject}) => {
    project.states = project.states.map(state => ({ ...state, isFinal: stateIDs.includes(state.id) ? !state.isFinal : state.isFinal }))
  })),

  /* Toggle direction of transitions */
  flipTransitions: (transitionIDs: number[]) => set(produce(({ project }: {project: StoredProject}) => {
    project.transitions = project.transitions.map(t => transitionIDs.includes(t.id)
      ? ({
          ...t,
          from: t.to,
          to: t.from
        })
      : t)
  })),

  /* Remove states by id */
  removeStates: (stateIDs: number[]) => set(produce(({ project }: {project: StoredProject}) => {
    // Remove states
    project.states = project.states.filter((st: AutomataState) => !stateIDs.includes(st.id))

    // Remove associated transitions
    project.transitions = project.transitions.filter((t: AutomataTransition) => !stateIDs.includes(t.from) && !stateIDs.includes(t.to))
  })),

  /* Remove transitions by id */
  removeTransitions: (transitionIDs: number[]) => set(produce(({ project }: {project: StoredProject}) => {
    project.transitions = project.transitions.filter((t: AutomataTransition) => !transitionIDs.includes(t.id))
  })),

  /* Remove comments by id */
  removeComments: (commentIDs: number[]) => set(produce(({ project }: {project: StoredProject}) => {
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
