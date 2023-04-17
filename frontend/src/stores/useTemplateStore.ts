import { create, SetState, GetState } from 'zustand'
import { persist } from 'zustand/middleware'
import produce, { current } from 'immer'

import {
  ProjectType,
  Template
} from '../types/ProjectTypes'

import {
  DEFAULT_PROJECT_TYPE,
} from '../config/projects'

export const createNewTemplate = (projectType: ProjectType = DEFAULT_PROJECT_TYPE): Template => ({
    _id: crypto.randomUUID(),
    states: [],
    transitions: [],
    comments: [],
    initialStateId: null,
    projectType,
    projectSource: '',
    name: ''
})

interface TemplateStore {
  template: Template,
  set: (template: Template) => void,
  /**
   * Updates the current project. This doesn't reset the history like `set`
   * @param project
   */
  update: (template: Template) => void,
  setName: (newName: string) => void
}

const useTemplateStore = create<TemplateStore>()(persist((set: SetState<TemplateStore>, get: GetState<TemplateStore>) => ({
  template: null as Template,

  set: (template: Template) => { set({ template }) },

  update: (template: Template) => set(produce((state: TemplateStore) => {
    state.template = template
  })),

  /* Change the projects name */
  setName: (newName: string) => set((s: TemplateStore) => ({
    template: { ...s.template, name: newName }
  })),
}), {
  name: 'automatarium-template'
}))

export default useTemplateStore