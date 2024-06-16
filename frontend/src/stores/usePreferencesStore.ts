import { create, SetState } from 'zustand'
import { persist } from 'zustand/middleware'
import { ColourName } from '../config/colors'
import { AutomatariumTheme } from '../types/ProjectTypes'

export interface Preferences {
  theme: AutomatariumTheme
  color: ColourName | 'match'
  showGrid: boolean
  ctrlZoom: boolean
  pauseTM: boolean
}

interface PreferencesStore {
  preferences: Preferences
  setPreferences: (preferences: Preferences) => void
}

const defaultPreferences: Preferences = {
  theme: 'system',
  color: 'match',
  showGrid: true,
  ctrlZoom: !navigator.platform?.match(/Win/), // Default to false on windows, which more often has a mouse
  pauseTM: true
}

const usePreferencesStore = create<PreferencesStore>()(persist((set: SetState<PreferencesStore>) => ({
  preferences: { ...defaultPreferences },
  setPreferences: (preferences: Preferences) => set({ preferences })
}), {
  name: 'automatarium-preferences'
}))

export default usePreferencesStore
