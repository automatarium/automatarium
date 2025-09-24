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
  language: string
}

interface PreferencesStore {
  preferences: Preferences
  setPreferences: (preferences: Preferences) => void
  /**
  * Gets the current selected theme. Resolves system theme if the user has "system" selected
  */
  getTheme: () => 'light' | 'dark'
}

const defaultPreferences: Preferences = {
  theme: 'system',
  color: 'match',
  showGrid: true,
  ctrlZoom: !navigator.platform?.match(/Win/), // Default to false on windows, which more often has a mouse
  pauseTM: true,
  language: 'en'
}

const usePreferencesStore = create<PreferencesStore>()(persist((set: SetState<PreferencesStore>, get) => ({
  preferences: { ...defaultPreferences },
  setPreferences: (preferences: Preferences) => set({ preferences }),
  getTheme: () => {
    const theme = get().preferences.theme
    return theme === 'system'
          ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : theme
  }
}), {
  name: 'automatarium-preferences'
}))

export default usePreferencesStore
