import create from 'zustand'

import {firebase} from '../auth'
import { getUser } from '../services'

const useProfileStore = create((set, get) => ({
  profile: undefined,
  loaded: true,

  invalidate: async profile => {
    try {
      const { currentUser } = firebase.auth()
      if (currentUser) {
        if (profile === undefined) {
          profile = await getUser(currentUser.uid)
        }
        set({ profile, loaded: true })
        return true
      } else {
        throw new Error('No firebase user authenticated')
      }
    } catch (e) {
      set({ profile: undefined, loaded: true })
      return false
    }
  },

  signIn: async (email, password, getProfile = true) => {
    await firebase.auth().signInWithEmailAndPassword(email, password)
    if (getProfile) {
      await get().invalidate()
    }
  },

  signOut: async () => {
    await firebase.auth().signOut()
    await get().invalidate()
  },

  setLoading: () => set({ loaded: false }),
}))

export default useProfileStore