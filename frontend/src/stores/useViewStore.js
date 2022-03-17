import create from 'zustand'

const useViewStore = create(set => ({
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0},
  scale: 1,
  setViewPosition: position => set({ position }),
  setViewSize: size => set({ size }),
  setScale: scale => set({ scale }),
}))

export default useViewStore
