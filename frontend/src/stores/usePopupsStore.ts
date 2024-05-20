import { create, SetState } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Popups {
  showFinalState: boolean
}

interface PopupsStore {
  popups: Popups
  setPopups: (popups: Popups) => void
}

const defaultPopups: Popups = {
  showFinalState: true
}

const usePopupsStore = create<PopupsStore>()(persist((set: SetState<PopupsStore>) => ({
  popups: { ...defaultPopups },
  setPopups: (popups: Popups) => set({ popups })
}), {
  name: 'automatarium-popups'
}))

export default usePopupsStore
