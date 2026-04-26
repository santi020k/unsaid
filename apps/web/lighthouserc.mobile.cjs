/** @type {import('@lhci/cli').LighthouseRcConfig} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      startServerCommand: 'pnpm exec astro dev --host 127.0.0.1 --port 4321',
      url: ['http://127.0.0.1:4321/', 'http://127.0.0.1:4321/es/'],
      settings: {
        chromeFlags: '--headless=new --no-sandbox',
        emulatedFormFactor: 'mobile'
      }
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 5000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 900 }],
        'uses-responsive-images': 'warn',
        'uses-optimized-images': 'warn'
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci-mobile'
    }
  }
}
