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
- Read `.harness/config.json` for `use_codex` and `evaluator_strictness` settings
- Codex detection (3-step):
  1. Read `config.json` → `use_codex` field
  2. If `"off"`: skip Codex entirely, use Claude-based review
  3. If `"on"`: attempt `/codex:adversarial-review`, warn if not available
  4. If `"auto"` or absent: detect via `.claude/settings.json` (has `"codex@openai-codex": true`), use if available
- Classify findings as BLOCKING or NON-BLOCKING

### Grading
- Score using criteria from the domain profile, not hardcoded names. Default to software criteria if no profile specified.
- Be skeptical and replayable
- Score using integer `0-5`
- Fail if any primary criterion is below `3`
- Fail if any required contract check fails
- Record exact evidence and steps
- Test via browser automation (Playwright or Puppeteer), not by reading source code
- Watch for "display-only" features that render but lack interactive depth — this is the primary failure mode (Anthropic, March 2026)
- Walk through the feature's pre-defined `steps[]` from `features.json` during evaluation
- After scoring, set feature `maturity` based on scores: draft (any < 3), reviewed (all >= 3), polished (all >= 4). `accepted` is manual only.

### Rubric Anchors & Drift Detection
- After round 1: create `.harness/evaluator-calibration.md` with score anchors (2/3/4/5 descriptions) for each criterion
- Every round: reference anchors, compare against prior round scores
- If score changes by >1 from prior round, justify in `NN-evaluation.md` "Score Justification" section
- Include `justification`, `prior_round_score`, `drift_check` in `NN-evaluation.json` primary_scores

## Disagreement Rule

If generator and evaluator evidence conflict:

- prefer evaluator-owned acceptance status
- record the disagreement explicitly
- keep the feature failing if a blocking bug remains unresolved

## Do Not

- edit product code
- pass a round on prose confidence alone
- omit replayable steps
