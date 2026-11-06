# Requests for the tts_bot app, from the E2E tests

The E2E tests (repo `tts-bot-e2e-tests`) can't see these today. None of them change what users see.

| # | Request | Status |
|---|---|---|
| 1 | Name the joint slider knobs | Done in tts_bot `033d9dd` (2026-11-06) |
| 2 | "3D model loaded" signal | Done in tts_bot `033d9dd` (2026-11-06) |
| 3 | Read-only test hook | Done in tts_bot `033d9dd` (2026-11-06) |
| 4 | Test id on the Blockly workspace | Done in tts_bot `033d9dd` (2026-11-06) |

## 1. Name the joint slider knobs (accessibility bug)

In `src/app/components/robot/ArmControlPanel.tsx`, `CardSlider` puts `aria-label={label}` on
`SliderPrimitive.Root`. Radix only names the `Thumb`, which is the element with `role="slider"`,
so screen readers announce the Level 1 sliders with no name. Please also pass
`aria-label={label}` to `SliderPrimitive.Thumb`. This also fixes the colour-picker slider, which
uses the same component.

Tests will then find a slider with `getByRole('slider', { name: 'Base' })`.

## 2. A "3D model loaded" signal

There's no way to tell from the page that the arm finished loading and was drawn. The smoke test
can only check that the `.glb` file downloaded without errors. Please add
`data-testid="robot-scene"` to the 3D view's container, and set `data-model-loaded="true"` on it
at the end of the `GLTFLoader` success callback in `src/app/robot/useRobotScene.ts`.

## 3. A read-only test hook, only when `NEXT_PUBLIC_E2E=1`

LED colours and the Level 2 program only exist inside three.js and Blockly, so tests can't read
them. Please expose a read-only object when `process.env.NEXT_PUBLIC_E2E === "1"`, so it's never
in a normal build (staging, production or mobile):

    window.__ttsTest = {
      joints(),      // { base, j1, j2, j3, claw }: current values, including mid-animation
      leds(),        // current colour of each LED node as painted, keyed by the LED_NODE_MAP.md names
      sim(),         // refs.robotSim.getSnapshot(): power, pesr, battery, head/base themes
      tiles(),       // the current Level 2 program (Tile[])
      modelLoaded,   // true once the GLB is loaded and attached
    }

Read-only on purpose: no setters. Tests still drive the app only through the UI, like a user.

## 4. A test id on the Blockly workspace

`data-testid="program-workspace"` on the element Blockly is injected into, so tests can drag
blocks into it reliably.

## Not needed

The Level 2 buttons (Save, Open, Run, Pause, Stop, Clear All), the level tiles, the header level
button and the joint chips already have accessible names, so tests can find them without
`data-testid`s.
