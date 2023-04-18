import { create, SetState } from 'zustand'
import { persist } from 'zustand/middleware'

interface Preferences {
  theme: string
  color: string
  showGrid: boolean
  ctrlZoom: boolean
}

interface PreferencesStore {
  preferences: Preferences
  setPreferences: (preferences: Preferences) => void
}

const defaultPreferences: Preferences = {
  theme: 'system',
  color: 'match',
  showGrid: true,
  ctrlZoom: !navigator.platform?.match(/Win/) // Default to false on windows, which more often has a mouse
}

const usePreferencesStore = create<PreferencesStore>()(persist((set: SetState<PreferencesStore>) => ({
  preferences: { ...defaultPreferences },
  setPreferences: (preferences: Preferences) => set({ preferences })
}), {
  name: 'automatarium-preferences'
}))

export default usePreferencesStore
