import type {
  ModuleProject,
  ProjectType,
  ProjectConfig,
  ProjectComment,
  ProjectMetaData,
  AutomataTests,
  AutomataState,
  BaseAutomataTransition,
} from "@/types/ProjectTypes";
import {
  DEFAULT_ACCEPTANCE_CRITERIA,
  DEFAULT_OR_OPERATOR,
  DEFAULT_STATE_PREFIX,
  DEFAULT_PROJECT_TYPE,
  APP_VERSION,
  SCHEMA_VERSION,
} from "@/config";

type LegacyModule = {
  _id: string;
  name?: string;
  type?: ProjectType | string;
  states?: unknown[];
  transitions?: unknown[];
  startState?: string | null;
  meta?: Partial<ProjectMetaData>;
};

export function normalizeModule(m: LegacyModule): ModuleProject {
  const project = {
    _id: String(m._id),
    projectType: (m.type as ProjectType) ?? DEFAULT_PROJECT_TYPE,
    states: (m.states ?? []) as AutomataState[],
    transitions: (m.transitions ?? []) as BaseAutomataTransition[],
    initialState: m.startState ? Number(m.startState) : null,
    comments: [] as ProjectComment[],
    config: {
      acceptanceCriteria: DEFAULT_ACCEPTANCE_CRITERIA,
      color: "",
      orOperator: DEFAULT_OR_OPERATOR,
      statePrefix: DEFAULT_STATE_PREFIX,
      type: (m.type as ProjectType) ?? DEFAULT_PROJECT_TYPE,
    } as ProjectConfig,
    meta: {
      automatariumVersion: APP_VERSION,
      dateCreated: m.meta?.dateCreated ?? Date.now(),
      dateEdited: m.meta?.dateEdited ?? Date.now(),
      name: m.meta?.name ?? m.name ?? "Untitled",
      version: SCHEMA_VERSION,
    } as ProjectMetaData,
    simResult: [] as string[],
    tests: {
      batch: [],
      single: "",
    } as AutomataTests,
  };

  return project as ModuleProject;
}
