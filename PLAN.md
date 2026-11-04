# Plan

## Phase A: foundations (week 1)
- [x] 1. Repo, Playwright 1.64, Chromium, Playwright MCP
- [x] 2. playwright.config.ts (local servers, video, trace)
- [x] 3. CLAUDE.md, PLAN.md
- [x] 4. Smoke test: `/` → `/intro`, Level 1, Level 2 and Settings open, 3D model loads
- [ ] 5. First video review + break-on-purpose check; `/review-test` skill
- [ ] 6. App-team request: data-testids + non-production window hook

## Phase B: first suite (weeks 2–4)
- [ ] 7. Page objects: intro, Level 1, Level 2
- [ ] 8. Level 1: joints move and stop at limits
- [ ] 9. Power and LEDs on the built-in simulator (LED colours need the window hook)
- [ ] 10. Level 2 Blockly: moves + loop, run on the built-in simulator (joint chips show the final pose)
- [ ] 11. Save and reopen
- [ ] 12. Settings page
- [ ] Record a Skill spike (week 2): record 3 journeys, convert one, compare

## Phase C: free CI (weeks 3–4)
- [ ] 14. GitHub Actions: nightly + on demand
- [ ] 15. 0 failing tests on main, flaky.md near empty; `/triage-failure` skill

## Phase D: update-e2e-tests skill (weeks 5–6)
- [ ] 16. test-map.md
- [ ] 17. Skill
- [ ] 18. Try on a real feature branch

## Later
- Self-hosted runner, run after staging deploys
- Robot connection tests, once the physical robot arrives

## Trusted tests
| Test | Reviewed on | Broke on purpose | Status |
|---|---|---|---|
