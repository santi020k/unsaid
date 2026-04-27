import astroConfig from '@santi020k/eslint-config-astro'
import { eslintConfig, playwright } from '@santi020k/eslint-config-basic'

export default [
  {
    name: 'web/ignores-playwright-artifacts',
    ignores: [
      'playwright-report/**',
      'test-results/**'
    ]
  },
  ...eslintConfig({
    typescript: true,
    frameworks: { astro: astroConfig },
    tsconfigRootDir: import.meta.dirname
  }),
  {
    name: 'web/tailwind-settings',
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/global.css'
      }
    }
  },
  {
    name: 'web/astro-overrides',
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      // Custom @utility classes (skip-link, truth-card-*, btn-*, etc.) and
      // third-party classes (cf-turnstile) are not in the Tailwind catalog.
      // These are valid — entryPoint resolution is handled at build time.
      'better-tailwindcss/no-unknown-classes': 'off'
    }
  },
  {
    name: 'web/ignores',
    ignores: ['.astro/**', 'dist/**', 'node_modules/**']
  },
  {
    name: 'web/lighthouse-ci-commonjs',
    files: ['lighthouserc.cjs', 'lighthouserc.mobile.cjs'],
    languageOptions: {
      globals: {
        module: 'writable'
      }
    }
  },
  ...playwright.map(config => ({
    ...config,
    name: `web/${config.name ?? 'playwright-tests'}`,
    files: ['tests/**/*.ts']
  }))
]
