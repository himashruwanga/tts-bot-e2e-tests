import { test, expect } from '@playwright/test';

// Smoke tests: the app starts, each screen opens and the 3D model loads.
// Routes: ../tts_bot/CLAUDE.md. Home pose: HOME_STATE in ../tts_bot/src/app/robot/constants.ts.

// The arm's starting pose, as the app shows it. The Grabber is checked separately:
// it has Open/Close buttons, not a slider.
const HOME_POSE = [
  { joint: 'Base',     value: '135', chip: 'Base: 135°' },
  { joint: 'Shoulder', value: '0',   chip: 'Shoulder: 0°' },
  { joint: 'Elbow',    value: '0',   chip: 'Elbow: 0°' },
  { joint: 'Wrist',    value: '0',   chip: 'Wrist: 0°' },
];

test('/ redirects to the level select page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/intro$/);
  for (const tile of ['Level 1', 'Level 2', 'Settings']) {
    await expect(page.getByRole('link', { name: tile, exact: true })).toBeVisible();
  }
});

test('Level 1 opens with the arm in its home pose', async ({ page }) => {
  await page.goto('/intro');
  await page.getByRole('link', { name: 'Level 1', exact: true }).click();

  await expect(page).toHaveURL(/\/level-1$/);
  await expect(page.getByRole('button', { name: /Level 1 . change level/ })).toBeVisible();

  for (const { joint, value, chip } of HOME_POSE) {
    // The label sits on the slider's outer box, not on the knob (see the app-team request),
    // so find the box by its label, then the slider inside it.
    const slider = page.getByLabel(joint, { exact: true }).getByRole('slider');
    await expect(slider).toHaveAttribute('aria-valuenow', value);
    // The chip under the 3D model shows the same value.
    await expect(page.getByTitle(chip)).toBeVisible();
  }

  // Grabber: open at home, and Close is disabled because the pincer can't close at Home/Park.
  await expect(page.getByRole('button', { name: 'Open', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeDisabled();
  await expect(page.getByTitle('Grabber: Open')).toBeVisible();
});

test('Level 2 opens with the block editor', async ({ page }) => {
  await page.goto('/intro');
  await page.getByRole('link', { name: 'Level 2', exact: true }).click();

  await expect(page).toHaveURL(/\/level-2$/);
  await expect(page.getByRole('button', { name: /Level 2 . change level/ })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Block categories' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Run', exact: true })).toBeVisible();
});

test('Settings opens from the level select page', async ({ page }) => {
  await page.goto('/intro');
  await page.getByRole('link', { name: 'Settings', exact: true }).click();

  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole('button', { name: /Settings . change level/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
});

test('3D model loads without errors', async ({ page }) => {
  // Collect anything that would mean the model didn't load properly.
  const problems: string[] = [];
  page.on('pageerror', err => problems.push(`page error: ${err.message}`));
  page.on('console', msg => {
    if (msg.text().includes('not found in GLB')) problems.push(`missing part: ${msg.text()}`);
  });

  // Start listening before opening the page, so the download can't be missed.
  const modelResponse = page.waitForResponse(r => r.url().endsWith('/models/tts-robot-arm-colored.glb'));
  await page.goto('/level-1');

  const response = await modelResponse;
  expect(response.ok(), 'model file downloaded').toBe(true);
  await response.finished();
  await expect(page.locator('canvas')).toBeVisible();
  expect(problems).toEqual([]);
});
