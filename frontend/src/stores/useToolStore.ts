import { create } from 'zustand'

/**
 * Specifies a tool that can be used
 * @see Toolbar where all the tools are shown in the UI
 */
export type Tool = 'cursor' | 'hand' | 'state' | 'transition' | 'comment' | 'delete' | 'template'

interface ToolStore {
  tool: Tool
  setTool: (tool: Tool) => void
}

const useToolStore = create<ToolStore>(set => ({
  tool: 'cursor',
  setTool: tool => set({ tool })
}))

export default useToolStore
