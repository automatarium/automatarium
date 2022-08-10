import create from 'zustand'

const defaultOptions = {
  filename: '',
  type: 'png',
  margin: 20,
  color: '',
  darkMode: false,
  background: 'solid',
}

const useExportStore = create(set => ({
  exportVisible: false,
  options: { ...defaultOptions },

  setExportVisible: exportVisible => set({ exportVisible }),
  setOptions: options => set(state => ({ options: { ...state.options, ...options } })),
  reset: () => set({ options: { ...defaultOptions } }),
}))

export default useExportStore
