import { create } from 'zustand'
import produce from 'immer'
import { Coordinate, Size } from '../types/ProjectTypes'

interface ViewStore {
  svgElement: Element
  position: Coordinate
  size: Size
  scale: number
  moveViewPosition: (pos: Partial<Coordinate>) => void
  setViewPosition: (pos: Coordinate) => void
  setViewSize: (size: Size) => void
  setViewScale: (scale: number) => void
  setSvgElement: (element: Element) => void
  setViewPositionAndScale: (pos: Coordinate, scale: number) => void
  // Apply the view transform to a point
  applyView: (x: number, y: number) => [number, number]
  // Apply an inverse view transform to a point
  applyInverseView: (x: number, y: number) => [number, number]
  // Convert from screen mouse coords to view space
  screenToViewSpace: (clientX: number, clientY: number) => [number, number]
  // Convert from screen mouse coords to view space
  viewToScreenSpace: (viewX: number, viewY: number) => [number, number]
}

const screenToCanvasSpace = (x: number, y: number, container: Element): [number, number] => {
  const b = container.getBoundingClientRect()
  return [(x - b.left), (y - b.top)]
}

const canvasToScreenSpace = (x: number, y: number, container: Element): [number, number] => {
  const b = container.getBoundingClientRect()
  return [(x + b.left), (y + b.top)]
}

const useViewStore = create<ViewStore>((set, get) => ({
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

  applyView: (x, y) =>
    [x * get().scale + get().position.x, y * get().scale + get().position.y],

  applyInverseView: (x, y) =>
    [(x - get().position.x) / get().scale, (y - get().position.y) / get().scale],

  screenToViewSpace: (clientX, clientY) =>
    get().applyView(...screenToCanvasSpace(clientX, clientY, get().svgElement)),

  viewToScreenSpace: (viewX, viewY) =>
    canvasToScreenSpace(...get().applyInverseView(viewX, viewY), get().svgElement)
}))

export default useViewStore
