import { create, SetState } from 'zustand'
import { persist } from 'zustand/middleware'
import { Template } from 'src/types/ProjectTypes'

interface TemplatesStore {
  templates: Template[],
  setTemplates: (templates: Template[]) => void,
  clearTemplates: () => void,
  upsertTemplate: (template: Template) => void,
  deleteTemplate: (tid: string) => void,
}

const useTemplatesStore = create<TemplatesStore>()(persist((set: SetState<TemplatesStore>) => ({
  templates: [] as Template[],
  setTemplates: (templates: Template[]) => set({ templates }),
  clearTemplates: () => set({ templates: [] }),
  // Update template, or insert if it doesn't exist
  upsertTemplate: (template: Template) => set(s => ({
    templates: s.templates.find(t => t._id === template._id)
      ? s.templates.map(t => t._id === template._id ? template : t)
      : [...s.templates, template]
  })),
  deleteTemplate: (tid: string) => set(s => ({ templates: s.templates.filter(t => t._id !== tid) }))
}), {
  name: 'automatarium-templates'
}))

export default useTemplatesStore
