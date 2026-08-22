import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: ['package.json'],
    },
    'apps/web': {
      entry: ['src/pages/**/*.astro', 'package.json'],
      project: ['src/**/*.{ts,astro}', 'tests/**/*.ts'],
      ignoreDependencies: ['tailwindcss'],
    },
    'apps/api': {
      entry: ['wrangler.toml'],
      project: ['src/**/*.ts'],
    },
    'packages/shared': {
      entry: ['package.json'],
    },
  }
}

export default config
