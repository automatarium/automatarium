import type {
  ModuleProject,
  ProjectType,
  ProjectConfig,
  ProjectComment,
  ProjectMetaData,
  AutomataTests,
} from "@/types/ProjectTypes"

export function normalizeModule(m: any): ModuleProject {
  return {
    _id: String(m._id),

    // must be one of 'FSA' | 'PDA' | 'TM'
    projectType: (m.type as ProjectType) ?? "FSA",

    // graph fields
    states: m.states ?? [],
    transitions: m.transitions ?? [],
    initialState: m.startState ? Number(m.startState) : null,

    // required extras
    comments: [] as ProjectComment[],
    config: {
      acceptanceCriteria: "",
      color: "",
      orOperator: "|",
      statePrefix: "q",
      type: (m.type as ProjectType) ?? "FSA",
    } as ProjectConfig,
    meta: {
      automatariumVersion: "1.0.0",
      dateCreated: m.meta?.dateCreated ?? Date.now(),
      dateEdited: m.meta?.dateEdited ?? Date.now(),
      name: m.meta?.name ?? m.name ?? "Untitled",
      version: "1.0.0",
    } as ProjectMetaData,
    simResult: [],
    tests: {
      batch: [],
      single: "",
    } as AutomataTests,
  }
}
