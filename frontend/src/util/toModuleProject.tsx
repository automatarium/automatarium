import {
  ProjectType,
  ProjectConfig,
  ProjectComment,
  ProjectMetaData,
  AutomataTests,
  ModuleProject,
} from "@/types/ProjectTypes";
import {
  DEFAULT_PROJECT_TYPE,
  DEFAULT_ACCEPTANCE_CRITERIA,
  DEFAULT_OR_OPERATOR,
  DEFAULT_STATE_PREFIX,
  APP_VERSION,
  SCHEMA_VERSION,
} from "@/config";

const makeDefaultConfig = (type: ProjectType): ProjectConfig => ({
  acceptanceCriteria: DEFAULT_ACCEPTANCE_CRITERIA,
  color: "",
  orOperator: DEFAULT_OR_OPERATOR,
  statePrefix: DEFAULT_STATE_PREFIX,
  type,
});

type LegacyModule = {
  _id: string;
  name: string;
  type: ProjectType | string;
  states: any[];
  transitions: any[];
  startState: string;
  acceptStates: any[];
  meta?: {
    name?: string;
    dateCreated?: number;
    dateEdited?: number;
  };
};

export function toModuleProject(m: LegacyModule): ModuleProject {
  const id = String(m._id);

  return {
    _id: id,
    projectType: (m.type as ProjectType) ?? DEFAULT_PROJECT_TYPE,
    states: m.states ?? [],
    transitions: m.transitions ?? [],
    initialState: m.startState ? Number(m.startState) : null,
    comments: [] as ProjectComment[],
    config: makeDefaultConfig(
      (m.type as ProjectType) ?? DEFAULT_PROJECT_TYPE
    ),
    meta: {
      name: m.meta?.name ?? m.name ?? "Untitled",
      dateCreated: m.meta?.dateCreated ?? Date.now(),
      dateEdited: m.meta?.dateEdited ?? Date.now(),
      version: SCHEMA_VERSION,
      automatariumVersion: APP_VERSION,
    },
    simResult: [],
    tests: { batch: [], single: "" } as AutomataTests,
  };
}
