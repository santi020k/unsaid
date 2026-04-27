import { eslintConfig, Runtime } from '@santi020k/eslint-config-basic'
import hono from '@santi020k/eslint-config-hono'

export default [
  ...eslintConfig({
    typescript: true,
    runtime: Runtime.Worker,
    frameworks: { hono },
    tsconfigRootDir: import.meta.dirname
  }),
  {
    name: 'api/ignores',
    ignores: ['dist/**', 'node_modules/**', '.wrangler/**', 'vitest.config.ts']
  }
]
