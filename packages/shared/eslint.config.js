import { eslintConfig, Runtime } from '@santi020k/eslint-config-basic'

export default [
  ...eslintConfig({
    typescript: true,
    runtime: Runtime.Universal,
    tsconfigRootDir: import.meta.dirname
  }),
  {
    name: 'shared/ignores',
    ignores: ['dist/**', 'node_modules/**']
  }
]
