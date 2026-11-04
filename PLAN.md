# Plan

## Phase A: foundations (week 1)
- [x] 1. Repo, Playwright 1.64, Chromium, Playwright MCP
- [x] 2. playwright.config.ts (local servers, video, trace)
- [ ] 3. CLAUDE.md, PLAN.md
- [ ] 4. Smoke test: `/` → `/intro`, both levels open, 3D model loads (create folders, move testDir)
- [ ] 5. First video review + break-on-purpose check; `/review-test` skill
- [ ] 6. App-team request: data-testids + non-production window hook

## Phase B: first suite (weeks 2–4)
- [ ] 7. Page objects: intro, Level 1, Level 2, virtual arm page
- [ ] 8. Level 1: joints move and stop at limits
- [ ] 9. Virtual arm: connect, run, arm receives commands
- [ ] 10. Power and LEDs (LED colours need the window hook)
- [ ] 11. Level 2 Blockly: moves + loop, run on the arm
- [ ] 12. Save and reopen
- [ ] 13. Settings page
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

## Trusted tests
| Test | Reviewed on | Broke on purpose | Status |
|---|---|---|---|
