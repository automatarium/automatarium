import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/tests/**/*.test.ts']
}

export default config
