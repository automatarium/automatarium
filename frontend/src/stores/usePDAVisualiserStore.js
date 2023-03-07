import create from "zustand";

const usePDAVisualiserStore = create((set) => ({
  stack: {},
  setStack: stack => set({ stack }),
  clearStack: () => set({ stack: {} })
  
}));

export default usePDAVisualiserStore;