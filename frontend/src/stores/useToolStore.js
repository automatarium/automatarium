import { create } from 'zustand'

const useToolStore = create(set => ({
  tool: 'cursor',
  setTool: tool => set({ tool })
}))

export default useToolStore
