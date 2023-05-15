import { create, SetState } from 'zustand'

import {
  Template
} from '../types/ProjectTypes'

interface TemplateStore {
  template: Template,
  setTemplate: (template: Template) => void
  // update: (template: Template) => void,
  // setName: (newName: string) => void
}

const useTemplateStore = create<TemplateStore>((set: SetState<TemplateStore>) => ({
  template: null,
  setTemplate: template => {
    set({ template })
  }
  // update: (template) => {

  // },
  // setName: (newName) => {

  // }
}))

export default useTemplateStore
