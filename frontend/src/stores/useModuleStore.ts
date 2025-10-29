import { create } from "zustand";
import { persist } from "zustand/middleware";
import { randomProjectName } from "../util/projectName";
import { Project, ProjectType } from "../types/ProjectTypes";
import {
  APP_VERSION,
  SCHEMA_VERSION,
  DEFAULT_STATE_PREFIX,
  DEFAULT_OR_OPERATOR,
  DEFAULT_PROJECT_TYPE,
  DEFAULT_ACCEPTANCE_CRITERIA,
} from "/src/config";

export function createNewModuleProject(type: ProjectType, name?: string) {
  return {
    _id: crypto.randomUUID(),
    projectType: type,
    states: [],
    transitions: [],
    initialState: null,
    comments: [],
    config: {
      acceptanceCriteria: DEFAULT_ACCEPTANCE_CRITERIA,
      color: "",
      orOperator: DEFAULT_OR_OPERATOR,
      statePrefix: DEFAULT_STATE_PREFIX,
      type,
    },
    meta: {
      name: name ?? "New Project",
      dateCreated: Date.now(),
      dateEdited: Date.now(),
      version: SCHEMA_VERSION,
      automatariumVersion: APP_VERSION,
    },
    simResult: [],
    tests: {
      batch: [],
      single: "",
    },
  } as ModuleProject;
}

/** Types */
export type ModuleProject = Project & { _id: string };

export interface ModuleMetaData {
  automatariumVersion: string;
  dateCreated: number;
  dateEdited: number;
  name: string;
  version: string;
}

export type ModuleQuestionsDict = Record<string, string>;

export type StoredModule = {
  _id: string;
  description: string;
  projects: ModuleProject[];
  questions: ModuleQuestionsDict;
  meta: ModuleMetaData;
};

export const createNewModule = (
  description = "Write a description here"
): StoredModule => ({
  _id: crypto.randomUUID(),
  description,
  projects: [],
  questions: {},
  meta: {
    name: randomProjectName(),
    dateCreated: Date.now(),
    dateEdited: Date.now(),
    version: SCHEMA_VERSION,
    automatariumVersion: APP_VERSION,
  },
});

/** Zustand store */
interface ModuleStore {
  module: StoredModule | null;
  showModuleWindow: boolean;
  lastChangeDate: number | null;
  // Actions
  setModule: (module: StoredModule | null) => void;
  setProjects: (projects: ModuleProject[]) => void;
  clearProjects: () => void;
  upsertProject: (project: ModuleProject) => void;
  deleteProject: (id: string) => void;
  getProject: (index: number) => ModuleProject | undefined;
  getProjectById: (id: string) => ModuleProject | undefined;
  setName: (name: string) => void;
  setShowModuleWindow: (show: boolean) => void;
  setModuleDescription: (description: string) => void;
  upsertQuestion: (pid: string, question: string) => void;
  deleteQuestion: (pid: string) => void;
  setAllProjectNames: (name: string) => void;
}

const useModuleStore = create<ModuleStore>()(
  persist(
    (set, get) => ({
      module: null,
      showModuleWindow: false,
      lastChangeDate: null,

      setModule: (module) => set({ module }),

      setProjects: (projects) =>
        set((state) =>
          state.module
            ? { module: { ...state.module, projects } }
            : state
        ),

      clearProjects: () =>
        set((state) =>
          state.module
            ? { module: { ...state.module, projects: [] } }
            : state
        ),

      upsertProject: (project) =>
        set((state) => {
          if (!state.module) return state;
          const exists = state.module.projects.some((p) => p._id === project._id);
          const updated = exists
            ? state.module.projects.map((p) =>
                p._id === project._id ? project : p
              )
            : [...state.module.projects, project];
          return {
            module: { ...state.module, projects: updated },
            lastChangeDate: Date.now(),
          };
        }),

      deleteProject: (id) =>
        set((state) =>
          state.module
            ? {
                module: {
                  ...state.module,
                  projects: state.module.projects.filter(
                    (p) => p._id !== id
                  ),
                },
                lastChangeDate: Date.now(),
              }
            : state
        ),

      getProject: (index) => get().module?.projects[index],

      getProjectById: (id) =>
        get().module?.projects.find((p) => p._id === id),

      setName: (name) =>
        set((state) =>
          state.module
            ? {
                module: {
                  ...state.module,
                  meta: { ...state.module.meta, name },
                },
                lastChangeDate: Date.now(),
              }
            : state
        ),

      setModuleDescription: (description) =>
        set((state) =>
          state.module
            ? {
                module: { ...state.module, description },
                lastChangeDate: Date.now(),
              }
            : state
        ),

      setAllProjectNames: (name) =>
        set((state) =>
          state.module
            ? {
                module: {
                  ...state.module,
                  projects: state.module.projects.map((p) => ({
                    ...p,
                    meta: { ...p.meta, name },
                  })),
                },
                lastChangeDate: Date.now(),
              }
            : state
        ),

      setShowModuleWindow: (show) => set({ showModuleWindow: show }),

      upsertQuestion: (pid, question) =>
        set((state) =>
          state.module
            ? {
                module: {
                  ...state.module,
                  questions: { ...state.module.questions, [pid]: question },
                },
                lastChangeDate: Date.now(),
              }
            : state
        ),

      deleteQuestion: (pid) =>
        set((state) =>
          state.module
            ? {
                module: {
                  ...state.module,
                  questions: Object.fromEntries(
                    Object.entries(state.module.questions).filter(
                      ([key]) => key !== pid
                    )
                  ),
                },
                lastChangeDate: Date.now(),
              }
            : state
        ),
    }),
    {
      name: "automatarium-module",
      version: 1,
    }
  )
);

export default useModuleStore;
