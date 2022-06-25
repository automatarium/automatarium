import create from 'zustand'
import { persist } from 'zustand/middleware'

const usePreferencesStore = create(persist(set => ({
  preferences: {
    theme: 'system',
    color: 'match',
    showGrid: true,
    ctrlZoom: !navigator.platform?.match(/Win/),
  },

  setPreferences: preferences => set({ preferences }),
}), {
  name: 'automatarium-preferences'
}))

export default usePreferencesStore
