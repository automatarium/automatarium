import { create, SetState } from 'zustand'
import { persist } from 'zustand/middleware'
import { StoredLab } from './useLabStore'

interface LabsStore {
    labs: StoredLab[],
    setLabs: (projects: StoredLab[]) => void,
    clearLabs: () => void,
    upsertLab: (project: StoredLab) => void,
    deleteLab: (pid: string) => void,
  }
  
  const useLabsStore = create<LabsStore>()(persist((set: SetState<LabsStore>) => ({
  labs: [] as StoredLab[],
  setLabs: (labs: StoredLab[]) => set({ labs }),
  clearLabs: () => set({ labs: [] }),
  upsertLab: (lab: StoredLab) => set((state) => ({
      labs: state.labs.find(l => l._id === lab._id)
      ? state.labs.map(l => l._id === lab._id ? lab : l)
      : [...state.labs, lab]
  })),
  deleteLab: (id: string) => set((state) => ({ labs: state.labs.filter(l => l._id !== id) }))
  }), {
    name: 'automatarium-labs'
  }))
  
  export default useLabsStore