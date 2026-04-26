import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: ['package.json'],
    },
    'apps/web': {
      entry: ['src/pages/**/*.astro', 'package.json', 'playwright.config.ts'],
      project: ['src/**/*.{ts,astro}', 'tests/**/*.ts'],
      ignoreDependencies: ['tailwindcss', '@lhci/cli'],
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
