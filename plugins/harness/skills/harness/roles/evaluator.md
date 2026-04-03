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
- `plugins/harness/skills/harness-sdlc/SKILL.md` (when domain_profile is "software") for runtime verification procedures

## Write

- `.harness/sprints/NN-contract-review.md`
- `.harness/sprints/NN-evaluation.md`
- `.harness/sprints/NN-evaluation.json`

## Three Responsibilities

### 0. Code Review Pre-Flight (MANDATORY — do this BEFORE reviewing any code)

Execute these steps IN ORDER and record results in the evaluation artifact:

**Step 1**: Read `.harness/config.json`. Extract `use_codex` value. If file missing, default to `"auto"`.

**Step 2**: Decide review mode:
- If `"off"` → set review_mode to `"claude"`. Skip to Step 4.
- If `"on"` → set review_mode to `"codex"`. Go to Step 3.
- If `"auto"` or missing → Read `.claude/settings.json`. Check if `"openai-codex"` exists as a key in `extraKnownMarketplaces` OR if `"codex@openai-codex": true` exists in `enabledPlugins`. If either is true, set review_mode to `"codex"`. Otherwise set to `"claude"`.

**Step 3** (codex mode only): Run the adversarial review command:
```
Bash({ command: "codex --approval-mode full-auto --quiet 'Review these code changes adversarially. Check quality, security, patterns, and design choices. Output findings as BLOCKING or NON-BLOCKING.'", timeout: 120000 })
```
If the command fails (codex CLI not installed, not authenticated, or errors), set review_mode to `"claude"` and record fallback_reason with the error message. The evaluator continues with Claude-only review — codex failure is never a hard block.

**Step 4**: Record in BOTH `NN-evaluation.md` and `NN-evaluation.json`:
- `review_mode`: codex or claude
- `config_use_codex`: value from config.json
- `codex_available`: whether openai-codex was found in settings (extraKnownMarketplaces or enabledPlugins)
- `detection_result`: what detection found
- `fallback_reason`: why codex wasn't used (if applicable)

**CRITICAL**: If you skip this pre-flight or default to "claude" without documenting the detection steps, the evaluation is INVALID.

### Testing
- Write and run tests (TDD for code, BDD for user-facing, smoke for infra)
- Target 80% coverage for new/changed code
- Detect test framework from project config (package.json, existing test dirs)
- Run all test suites and report results in the evaluation artifact

### Code Review
- Use the review_mode determined in the Pre-Flight (Step 0) above
- Check code quality: readability, security, patterns compliance, performance, error handling
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
