import { create, SetState } from 'zustand'

import {
  Template
} from '../types/ProjectTypes'

interface TemplateStore {
  template: Template,
  setTemplate: (template: Template) => void
  // TODO: Support updating/renaming
}

const useTemplateStore = create<TemplateStore>((set: SetState<TemplateStore>) => ({
  template: null,
  setTemplate: template => {
    set({ template })
  }
}))

export default useTemplateStore
