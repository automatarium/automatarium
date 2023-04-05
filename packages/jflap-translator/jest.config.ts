import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
}

export default config
