import create from 'zustand'
import produce from 'immer'

const useViewStore = create(set => ({
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0},
  scale: 1,
  moveViewPosition: ({ x=0, y=0 }) => set(produce(state => {
    state.position.x += x * state.scale
    state.position.y += y * state.scale
  })),
  setViewPosition: position => set({ position }),
  setViewSize: size => set({ size }),
  setScale: scale => set({ scale }),
}))

export default useViewStore
