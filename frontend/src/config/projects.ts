import packageConfig from '../../package.json'
import { COLOR_KEY } from './colors'
import { ProjectType } from '../types/ProjectTypes'

export const SCHEMA_VERSION = packageConfig.schemaVersion
export const APP_VERSION = packageConfig.version
export const DEFAULT_PROJECT_TYPE = 'FSA'
export const DEFAULT_STATE_PREFIX = 'q'
export const DEFAULT_ACCEPTANCE_CRITERIA = 'both'
export const DEFAULT_PROJECT_COLOR: Record<ProjectType, COLOR_KEY> = {
  FSA: 'orange',
  PDA: 'red',
  TM: 'purple'
}
