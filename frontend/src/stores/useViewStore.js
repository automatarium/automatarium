import create from 'zustand'
import produce from 'immer'

const relativeMousePosition = (x, y, container) => {
  const b = container.getBoundingClientRect()
  return [(x - b.left), (y - b.top)]
}


const useViewStore = create((set, get) => ({
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0},
  scale: 1,
  moveViewPosition: ({ x=0, y=0 }) => set(produce(state => {
    state.position.x += x * state.scale
    state.position.y += y * state.scale
  })),
  setViewPosition: position => set({ position }),
  setViewSize: size => set({ size }),
  setViewScale: scale => set({ scale }),

  /* Apply the view to transform a point */
  applyView: (x, y) => 
    [x * get().scale + get().position.x, y * get().scale + get().position.y],

  /* Convert from screen mouse coords to view space*/
  screenToViewSpace: (clientX, clientY, container) =>
    get().applyView(...relativeMousePosition(clientX, clientY, container))

}))

export default useViewStore
