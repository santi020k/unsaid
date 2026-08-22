import { defineConfig, devices } from '@playwright/test'

const host = '127.0.0.1'
const port = 4397
const baseURL = `http://${host}:${port}`
const isCi = Boolean(process.env.CI)

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 1 : '50%',
  reporter: isCi ? [['github'], ['line']] : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] }
    }
  ],
  webServer: {
    command: `pnpm exec astro dev --host ${host} --port ${port}`,
    env: {
      ...process.env,
      ASTRO_DEV_BACKGROUND: '0'
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: baseURL
  }
})
