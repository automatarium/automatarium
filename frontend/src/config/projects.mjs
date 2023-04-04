import packageConfig from '/package.json'

export const SCHEMA_VERSION = packageConfig.schemaVersion
export const APP_VERSION = packageConfig.version
export const DEFAULT_PROJECT_TYPE = 'FSA'
export const DEFAULT_STATE_PREFIX = 'q'
export const DEFAULT_ACCEPTANCE_CRITERIA = 'both'
export const DEFAULT_PROJECT_COLOR = {
  FSA: 'orange',
  PDA: 'red',
  TM: 'purple'
}
export const PDA_PROJECT_TYPE = 'PDA'
