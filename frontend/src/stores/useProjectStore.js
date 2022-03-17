import create from 'zustand'
import { uuidv4 as uuid } from 'uuid'

import {
  APP_VERSION,
  SCHEMA_VERSION,
  DEFAULT_PROJECT_TYPE,
  DEFAULT_STATE_PREFIX,
  DEFAULT_PROJECT_TYPE,
  DEFAULT_ACCEPTANCE_CRITERIA,
  DEFAULT_PROJECT_COLOR,
  DEFAULT_PLAYBACK_INTERVAL,
} from '/src/config/projects'

const createNewProject = () => ({
    id: uuid(),
    states: [],
    transitions: [],
    comments: [],
    tests: [],
    initialState: null,
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
  project: createNewProject(),
  set: project => set({ project }),
  reset: () => set({ project: createNewProject() })
}))

export default useProjectStore 
