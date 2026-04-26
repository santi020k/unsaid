import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: [],
      ignoreDependencies: ['turbo'],
    },
    'apps/web': {
      entry: ['src/pages/**/*.astro', 'astro.config.ts', 'eslint.config.js'],
      project: ['src/**/*.{ts,astro}'],
    },
    'apps/api': {
      entry: ['src/index.ts', 'wrangler.toml'],
      project: ['src/**/*.ts'],
    },
    'packages/shared': {
      entry: ['src/index.ts'],
    },
  },
  ignore: ['dist/**', '.astro/**', '.wrangler/**'],
}

export default config
