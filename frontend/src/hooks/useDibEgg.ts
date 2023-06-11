import { create } from 'zustand'
import COLORS from '/src/config/colors'

type Timer = ReturnType<typeof setInterval>

interface DibStore {
  intervalID: Timer
  setIntervalID: (id: Timer) => void
}

// Store state of easter egg across site instance
const useDibStore = create<DibStore>((set) => ({
  intervalID: undefined,
  setIntervalID: id => set({ intervalID: id })
}))

// Smoothly change between all colours
const smoothHue = () => {
  // Get current hue
  const currHue = Number(document.documentElement.style.getPropertyValue('--primary-h'))
  // Set colour to new hue
  document.documentElement.style.setProperty('--primary-h', ((currHue + 1) % 360).toString())
  document.documentElement.style.setProperty('--primary-s', '63%')
  document.documentElement.style.setProperty('--primary-l', '48%')
}

// Cycle between colours of the site preferences
const hues = Object.values(COLORS)
const rainbowRoadHue = () => {
  const currHue = Number(document.documentElement.style.getPropertyValue('--primary-h'))
  // Calculate which hue to begin at & which hue is next
  let hueIndex = hues.findIndex(c => c.h === currHue)
  if (hueIndex === -1) {
    hueIndex = 0
  } else {
    hueIndex = (hueIndex + 1) % hues.length
  }
  // Set colour
  document.documentElement.style.setProperty('--primary-h', hues[hueIndex].h.toString())
  document.documentElement.style.setProperty('--primary-s', `${hues[hueIndex].s}%`)
  document.documentElement.style.setProperty('--primary-l', `${hues[hueIndex].l}%`)
}

const useDibEgg = () => {
  const { intervalID, setIntervalID } = useDibStore()
  return (input: string, accepted: boolean) => {
    // If user types dib and automaton accepts
    if (input === 'dib' && accepted) {
      if (intervalID) {
        clearInterval(intervalID)
        setIntervalID(undefined)
      } else {
        setIntervalID(setInterval(smoothHue, 200))
      }
    // User types rainbowroad and automaton accepts
    } else if (input === 'rainbowroad' && accepted) {
      if (intervalID) {
        clearInterval(intervalID)
        setIntervalID(undefined)
      } else {
        setIntervalID(setInterval(rainbowRoadHue, 300))
      }
    }
  }
}

export default useDibEgg
