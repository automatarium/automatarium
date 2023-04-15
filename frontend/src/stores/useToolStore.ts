import { create } from 'zustand'

/**
 * Specifies a tool that can be used
 * @see Toolbar where all the tools are shown in the UI
 */
export type Tool = 'cursor' | 'hand' | 'state' | 'transition' | 'comment'

interface ToolStore {
  tool: Tool
}

const useToolStore = create<ToolStore>(set => ({
  tool: 'cursor',
  setTool: tool => set({ tool })
}))

export default useToolStore
