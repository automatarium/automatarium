import create from 'zustand'

const useExportStore = create(set => ({
  exportVisible: false,
  options: {
    filename: '',
    type: 'png',
    padding: 20,
    color: '',
    darkMode: false,
    background: 'none',
  },

  setExportVisible: exportVisible => set({ exportVisible }),
  setOptions: options => set(state => ({ options: { ...state.options, ...options } })),
}))

export default useExportStore
