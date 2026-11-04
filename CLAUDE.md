# TTS Bot E2E tests

Playwright end-to-end tests for the TTS Robot Arm app in `../tts_bot`. Read `../tts_bot/CLAUDE.md` to learn the app.

## Rules

- `../tts_bot` is read only. If the app needs a change (a `data-testid`, a test hook), list it for the user instead.
  Exception: to prove a test fails when its feature breaks, a temporary, uncommitted edit in `../tts_bot` is allowed. Say which file and line you broke, run the test to show it fails, then revert with `git checkout -- <file>` and check `git status` is clean.
- Propose each change or command and wait for the user's OK before doing it. The user is learning: explain what and why in plain words.
- Never change the app to make a test pass. Never delete an assertion, add `test.skip`, or add retries without asking.
- Base tests on `../tts_bot/docs/requirements/`, `../tts_bot/docs/knowledge-base/` and the app code. Ignore `../tts_bot/test/`.
- Locators: `getByRole`, `getByLabel`, `getByText`, `getByTestId`. No CSS or XPath chains.
- No `waitForTimeout`, no `force: true`. Wait for something the user would see (`expect(...).toHaveText(...)`, a network response).
- Free tools only unless the user agrees otherwise.
- Don't use or test the virtual robot arm (`../tts_bot/virtual-robot-arm`): it only stood in until the physical robot arrives. Check robot behaviour on the app's built-in simulator. Robot connection tests wait for the physical robot.

## Commands

```bash
npm test                                   # all tests (starts the app itself)
npx playwright test <path> -g "<name>"     # one test
npm run test:ui                            # UI mode: watch and step through tests
npm run test:review                        # slowMo 200 ms, each test 3 times: for video review
npm run report                             # open the last HTML report (videos, traces)
npx playwright show-trace <trace.zip>      # open one trace
BASE_URL=https://staging.tts-bot.spaceitlabs.dev npx playwright test   # against staging, no local servers
```

Stop any `npm run dev` in `../tts_bot` first: the tests start their own app server on port 3000.

Output: `test-results/` (video, trace and screenshots per test), `playwright-report/` (HTML report). Both are git-ignored.

## How the setup works

- `playwright.config.ts` `webServer` starts `../tts_bot` on port 3000 and stops it after the run.
- The app is started with `NEXT_PUBLIC_VIRTUAL_ARM_WS_URL=ws://localhost:8787/ws` as a safety net: `../tts_bot/.env.local` points at a shared online virtual arm, and tests must never reach it.
- `workers: 1`: Next dev mode compiles each page on its first visit; parallel tests race that and time out.
- Video, trace and screenshots are always on locally; CI keeps them only for failures.

## What tests can read (no app changes needed)

- Level 1 joint sliders: the `aria-label` is on the slider's outer box, not the knob, so use `getByLabel('<joint>', { exact: true }).getByRole('slider')` and read `aria-valuenow`. The Grabber is two buttons, Open and Close (`aria-pressed`), not a slider.
- Joint values as text, e.g. `90°` (`JointValueChips.tsx`).
- Simulator panel power state text (`RobotSimPanel.tsx`).
- Save/Open: remove `showSaveFilePicker`/`showOpenFilePicker` with `page.addInitScript` so the app saves by download and opens through a file input (`programStorage.ts`). Chrome's file picker itself stays a manual check.
- The 3D canvas has no DOM: check numbers above first; `toHaveScreenshot` only on the Linux CI runner.


## Layout

- `tests/`: test files (`*.spec.ts`)
- `pages/`: page objects (locators and actions for one screen)
- `fixtures/`: shared setup
- `utils/`: small helpers


## Reviewing a new or changed test

Run `npm run test:review -- <path>`, watch the video, then check:

1. The video shows the steps the test name describes.
2. The assertion checks what a user sees (joint angle, LED colour, block count), not only that an element exists.
3. It fails when the feature breaks (proven once, see the exception in Rules).
4. No shortcuts: no hard-coded state, fixed waits or `force: true`.
5. Mark it Trusted in `PLAN.md`, or log what to fix.

## When a test fails

Reproduce it, read the trace and video, and classify it: app bug, test bug, flaky, or environment. Fix the test; for an app bug, write a short bug report and stop. Re-run 3 times (`--repeat-each=3`). Add flaky tests to `flaky.md`.
