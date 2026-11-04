---
name: review-test
description: Review a new or changed Playwright test before it is trusted. Runs it 3 times slowed down with video, goes through the 5-point review checklist, and proposes a break-on-purpose check in ../tts_bot. Use when the user asks to review a test, or after a test is written or changed.
---

# Review a test

1. Ask which test to review (file and test name) if the user didn't say.
2. Run it: `REVIEW=1 npx playwright test <file> -g "<name>" --repeat-each=3`.
   Report how many runs passed. If any failed, stop and follow "When a test fails" in CLAUDE.md.
3. Read the test and go through the checklist in CLAUDE.md ("Reviewing a new or changed test").
   For each item, say pass or concern and point to the line.
   You can't watch videos: give the user the video paths in `test-results/` and tell them what
   the video should show, step by step (item 1 is theirs to confirm).
4. Propose one break-on-purpose edit in `../tts_bot`: file, line, the exact change, and the
   failure message you expect. Wait for the user's OK.
   After the edit: run the test once and check it fails for that reason; revert with
   `git -C ../tts_bot checkout -- <file>`; run it again to see it pass; check `git -C ../tts_bot status`.
   Never commit in ../tts_bot.
5. Give a row for the "Trusted tests" table in PLAN.md: test, date, what was broken, status.
