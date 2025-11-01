import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoredModule } from "./useModuleStore";

interface ModulesStore {
  modules: StoredModule[];
  setModules: (modules: StoredModule[]) => void;
  clearModules: () => void;
  upsertModule: (module: StoredModule) => void;
  deleteModule: (id: string) => void;
  getModuleById: (id: string) => StoredModule | undefined;
}

export const useModulesStore = create<ModulesStore>()(
  persist(
    (set, get) => ({
      modules: [],

      setModules: (modules) => set({ modules }),

      clearModules: () => set({ modules: [] }),

      upsertModule: (module) =>
        set((state) => {
          const exists = state.modules.some((m) => m._id === module._id);
          const updated = exists
            ? state.modules.map((m) => (m._id === module._id ? module : m))
            : [...state.modules, module];
          return { modules: updated };
        }),

      deleteModule: (id) =>
        set((state) => ({
          modules: state.modules.filter((m) => m._id !== id),
        })),

      getModuleById: (id) => get().modules.find((m) => m._id === id),
    }),
    {
      name: "automatarium-modules",
      version: 1,
    }
  )
);

export default useModulesStore;
