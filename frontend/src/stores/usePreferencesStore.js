import create from 'zustand'
import { persist } from 'zustand/middleware'

const usePreferencesStore = create(persist(set => ({
  preferences: {
    theme: 'system',
    color: 'match',
    showGrid: true,
  },

  setPreferences: preferences => set({ preferences }),
}), {
  name: 'automatarium-preferences'
}))

export default usePreferencesStore
