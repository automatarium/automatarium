import type {
  ProjectType,
  ProjectConfig,
  ProjectComment,
  ProjectMetaData,
  AutomataTests,
  ModuleProject,
  AutomataState,
  BaseAutomataTransition,
} from '@/types/ProjectTypes';
import {
  DEFAULT_PROJECT_TYPE,
  DEFAULT_ACCEPTANCE_CRITERIA,
  DEFAULT_OR_OPERATOR,
  DEFAULT_STATE_PREFIX,
  APP_VERSION,
  SCHEMA_VERSION,
} from '@/config';

const makeDefaultConfig = (type: ProjectType): ProjectConfig => ({
  acceptanceCriteria: DEFAULT_ACCEPTANCE_CRITERIA,
  color: '',
  orOperator: DEFAULT_OR_OPERATOR,
  statePrefix: DEFAULT_STATE_PREFIX,
  type,
});

type LegacyModule = {
  _id: string;
  name: string;
  type: ProjectType | string;
  states: unknown[];
  transitions: unknown[];
  startState: string | null;
  acceptStates: unknown[];
  meta?: Partial<ProjectMetaData>;
};

export function toModuleProject(m: LegacyModule): ModuleProject {
  const id = String(m._id);

  const project = {
    _id: id,
    projectType: (m.type as ProjectType) ?? DEFAULT_PROJECT_TYPE,
    states: (m.states ?? []) as AutomataState[],
    transitions: (m.transitions ?? []) as BaseAutomataTransition[],
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
    simResult: [] as string[],
    tests: { batch: [], single: "" } as AutomataTests,
  };

  return project as ModuleProject; // ✅ fixes ProjectType literal inference issue
}

