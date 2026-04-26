import { eslintConfig } from '@santi020k/eslint-config-basic'

export default [
  ...eslintConfig({ typescript: true }),
  {
    name: 'api/ignores',
    ignores: ['dist/**', 'node_modules/**', '.wrangler/**']
  }
]
