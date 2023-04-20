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

const myTemplate: Template = {
  states: [{
    "isFinal": false,
    "x": 815,
    "y": 350,
    "id": 6
  },
  {
    "isFinal": false,
    "x": 935,
    "y": 350,
    "id": 7
  },
  {
    "isFinal": true,
    "x": 1025,
    "y": 515,
    "id": 8
  },
  {
    "isFinal": false,
    "x": 875,
    "y": 515,
    "id": 9
  }],
  transitions: [
    {
      "from": 6,
      "to": 6,
      "id": 7,
      "read": "a"
    },
    {
      "from": 6,
      "to": 8,
      "id": 8,
      "read": "b"
    },
    {
      "from": 8,
      "to": 6,
      "id": 9,
      "read": "c"
    },
    {
      "from": 6,
      "to": 6,
      "id": 10,
      "read": "d"
    },
    {
      "from": 6,
      "to": 7,
      "id": 11,
      "read": "e"
    },
    {
      "from": 6,
      "to": 6,
      "id": 12,
      "read": "z"
    }
  ],
  comments: [],
  projectSource: '5e1250b2-bee4-48a1-88f1-ef3540b13df1',
  projectType: 'FSA',
  initialStateId: null,
  _id: 'template_id',
  name: 'my template'
}

interface TemplateStore {
  template: Template,
  isInserting: boolean,
  setTemplate: (template: Template) => void,
  setIsInserting: (isInserting: boolean) => void,
  update: (template: Template) => void,
  setName: (newName: string) => void
}

const useTemplateStore = create<TemplateStore>((set: SetState<TemplateStore>) => ({
  template: myTemplate,
  isInserting: false,
  setTemplate: template => {
    console.log('changing template')
    console.log(template)
    set({ template })
  },
  setIsInserting: isInserting => set({ isInserting }),
  update: (template) => {

  },
  setName: (newName) => {

  }
}))

export default useTemplateStore