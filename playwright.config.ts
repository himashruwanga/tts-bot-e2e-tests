import { defineConfig, devices } from '@playwright/test';

// Playwright config access to environment variables without requiring Node globals in the TS types.
declare const process: { env: Record<string, string | undefined> };

// Where tts_bot lives (read only: tests never change it).
const APP_DIR = '../tts_bot';

// BASE_URL set (e.g. staging) → test that site and don't start anything locally.
// Not set → start tts_bot and the virtual arm on this machine.
const BASE_URL = process.env.BASE_URL;
const isCI = !!process.env.CI;

// REVIEW=1 slows every action down so videos are easy to watch.
const isReview = !!process.env.REVIEW;

export default defineConfig({
  // Temporary: moves to ./projects/tts-bot/specs in Step 4.
  testDir: './tests',

  // One test at a time: the virtual arm sends every message to every connected client,
  // so two tests using it at once would see each other's commands.
  workers: 1,
  fullyParallel: false,

  // A leftover test.only fails CI instead of silently skipping the other tests.
  forbidOnly: isCI,
  // No automatic retries: a test that needs a retry is flaky, and we want to see that.
  retries: 0,

  // The first visit compiles pages in Next dev mode and the 3D model loads
  // with software graphics, so allow more than the 30s default.
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],                                 // live progress in the terminal
    ['html', { open: 'never' }],              // open with: npx playwright show-report
  ],

  use: {
    baseURL: BASE_URL ?? 'http://localhost:3000',

    // Locally: record everything, for reviewing tests.
    // CI: keep files only for failing tests (free artifact storage is small).
    video: isCI ? 'retain-on-failure' : 'on',
    trace: isCI ? 'retain-on-failure' : 'on',
    screenshot: isCI ? 'only-on-failure' : 'on',

    launchOptions: { slowMo: isReview ? 200 : 0 },
  },

  projects: [
    {
      name: 'tts-bot',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: BASE_URL ? undefined : [
    {
      name: 'app',
      command: 'npm run dev',
      cwd: APP_DIR,
      url: 'http://localhost:3000',
      // Point the app at the local arm instead of the shared online one in .env.local.
      env: { NEXT_PUBLIC_VIRTUAL_ARM_WS_URL: 'ws://localhost:8787/ws' },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      name: 'virtual-arm',
      command: 'npm run dev',
      cwd: `${APP_DIR}/virtual-robot-arm`,
      url: 'http://localhost:8787',
      // The arm has nothing that differs between runs, so an already-running one is fine.
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
  ],
});
