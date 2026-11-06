import { defineConfig, devices } from '@playwright/test';

// Playwright config access to environment variables without requiring Node globals in the TS types.
declare const process: { env: Record<string, string | undefined> };

// Where tts_bot lives (read only: tests never change it).
const APP_DIR = '../tts_bot';

// BASE_URL set (e.g. staging) → test that site and don't start anything locally.
// Not set → start tts_bot on this machine.
const BASE_URL = process.env.BASE_URL;
const isCI = !!process.env.CI;

// REVIEW=1 slows every action down so videos are easy to watch.
const isReview = !!process.env.REVIEW;

export default defineConfig({
  testDir: './tests',

  // One test at a time: Next dev mode compiles each page on its first visit, and
  // parallel tests racing that compile time out.
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

  webServer: BASE_URL ? undefined : {
    command: 'npm run dev',
    cwd: APP_DIR,
    url: 'http://localhost:3000',
    // The virtual arm isn't used (it only stood in until the physical robot arrives), but
    // ../tts_bot/.env.local points at the shared online arm. Point at localhost instead, so an
    // accidental Connect reaches nothing rather than an arm other people are using.
    env: {
      NEXT_PUBLIC_VIRTUAL_ARM_WS_URL: 'ws://localhost:8787/ws',
      // Turns on the app's read-only test hook, window.__ttsTest (../tts_bot/src/app/robot/e2eHook.ts).
      NEXT_PUBLIC_E2E: '1',
    },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
