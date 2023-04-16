import { create } from 'zustand'
import produce from 'immer'

const screenToCanvasSpace = (x, y, container) => {
  const b = container.getBoundingClientRect()
  return [(x - b.left), (y - b.top)]
}

const canvasToScreenSpace = (x, y, container) => {
  const b = container.getBoundingClientRect()
  return [(x + b.left), (y + b.top)]
}

const useViewStore = create((set, get) => ({
  svgElement: null,
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0 },
  scale: 1,
  moveViewPosition: ({ x = 0, y = 0 }) => set(produce(state => {
    state.position.x += x * state.scale
    state.position.y += y * state.scale
  })),
  setViewPosition: position => set({ position }),
  setViewSize: size => set({ size }),
  setViewScale: scale => set({ scale }),
  setSvgElement: svgElement => set({ svgElement }),
  setViewPositionAndScale: (position, scale) => set({ position, scale }),

  /* Apply the view transform to a point */
  applyView: (x, y) =>
    [x * get().scale + get().position.x, y * get().scale + get().position.y],

  /* Apply an inverse view transform to a point */
  applyInverseView: (x, y) =>
    [(x - get().position.x) / get().scale, (y - get().position.y) / get().scale],

  /* Convert from screen mouse coords to view space */
  screenToViewSpace: (clientX, clientY) =>
    get().applyView(...screenToCanvasSpace(clientX, clientY, get().svgElement)),

  /* Convert from screen mouse coords to view space */
  viewToScreenSpace: (viewX, viewY) =>
    canvasToScreenSpace(...get().applyInverseView(viewX, viewY), get().svgElement)
}))

export default useViewStore
