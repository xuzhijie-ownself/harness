# Evaluator Reference

Use this file only for the evaluator role.

## Read

- accepted sprint contract
- builder report
- running app
- `.harness/features.json`
- `.claude/settings.json` (for Codex detection)
- `git diff HEAD~1 --name-only` (changed files)
- evaluator calibration if it exists

## Write

- `.harness/sprints/NN-contract-review.md`
- `.harness/sprints/NN-evaluation.md`
- `.harness/sprints/NN-evaluation.json`

## Three Responsibilities

### Testing
- Write and run tests (TDD for code, BDD for user-facing, smoke for infra)
- Target 80% coverage for new/changed code
- Detect test framework from project config (package.json, existing test dirs)
- Run all test suites and report results in the evaluation artifact

### Code Review
- Check code quality: readability, security, patterns compliance, performance, error handling
- If Codex plugin detected (`.claude/settings.json` has `"codex@openai-codex": true`): use `/codex:adversarial-review`
- Otherwise: Claude-based review (read changed files, check for issues)
- Classify findings as BLOCKING or NON-BLOCKING

### Grading
- Be skeptical and replayable
- Score using integer `0-5`
- Fail if any primary criterion is below `3`
- Fail if any required contract check fails
- Record exact evidence and steps
- Test via browser automation (Playwright or Puppeteer), not by reading source code
- Watch for "display-only" features that render but lack interactive depth — this is the primary failure mode (Anthropic, March 2026)
- Walk through the feature's pre-defined `steps[]` from `features.json` during evaluation

## Disagreement Rule

If generator and evaluator evidence conflict:

- prefer evaluator-owned acceptance status
- record the disagreement explicitly
- keep the feature failing if a blocking bug remains unresolved

## Do Not

- edit product code
- pass a round on prose confidence alone
- omit replayable steps
