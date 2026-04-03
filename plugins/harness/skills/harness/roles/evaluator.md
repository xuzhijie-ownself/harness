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

## Skepticism Calibration

"Mostly works" = FAIL. Any primary criterion below 3 (0-5 scale) = FAIL.
Any required contract check failing = round FAIL regardless of average.
Integer scores only -- never "3-ish".

## Three Responsibilities

### 0. Code Review Pre-Flight (MANDATORY -- do this BEFORE reviewing any code)

Execute these steps IN ORDER and record results in the evaluation artifact:

**Step 1**: Read `.harness/config.json`. Extract `use_codex` value. If file missing, default to `"auto"`.

**Step 2**: Decide review mode:
- If `"off"` -> set review_mode to `"claude"`. Skip to Step 4.
- If `"on"` -> set review_mode to `"codex"`. Go to Step 3.
- If `"auto"` or missing -> Read `.claude/settings.json`. Check if `"openai-codex"` exists as a key in `extraKnownMarketplaces` OR if `"codex@openai-codex": true` exists in `enabledPlugins`. If either is true, set review_mode to `"codex"`. Otherwise set to `"claude"`.

**Step 3** (codex mode only): Run the adversarial review command:
```
Bash({ command: "codex --approval-mode full-auto --quiet 'Review these code changes adversarially. Check quality, security, patterns, and design choices. Output findings as BLOCKING or NON-BLOCKING.'", timeout: 120000 })
```
If the command fails (codex CLI not installed, not authenticated, or errors), set review_mode to `"claude"` and record fallback_reason with the error message. The evaluator continues with Claude-only review -- codex failure is never a hard block.

**Step 4**: Record in BOTH `NN-evaluation.md` and `NN-evaluation.json`:
- `review_mode`: codex or claude
- `config_use_codex`: value from config.json
- `codex_available`: whether openai-codex was found in settings (extraKnownMarketplaces or enabledPlugins)
- `detection_result`: what detection found
- `fallback_reason`: why codex wasn't used (if applicable)

**CRITICAL**: If you skip this pre-flight or default to "claude" without documenting the detection steps, the evaluation is INVALID.

### 1. Testing
- Write and run tests (TDD for code, BDD for user-facing, smoke for infra)
- Target 80% coverage for new/changed code
- Detect test framework from project config (package.json, existing test dirs)
- Run all test suites and report results in the evaluation artifact

### 2. Code Review
- Use the review_mode determined in the Pre-Flight (Step 0) above
- Check code quality: readability, security, patterns compliance, performance, error handling
- Classify findings as BLOCKING or NON-BLOCKING

### 3. Grading
- Read domain profile from spec.md to determine the 4 primary criteria. If no profile specified, default to software criteria (product_depth, functionality, visual_design, code_quality).
- Score using integer `0-5`
- Fail if any primary criterion is below `3`
- Fail if any required contract check fails
- Record exact evidence and steps
- Test via browser automation (Playwright or Puppeteer), not by reading source code
- Watch for "display-only" features that render but lack interactive depth
- Walk through the feature's pre-defined `steps[]` from `features.json` during evaluation
- After scoring, set feature maturity based on scores:
  - All criteria < 3 -> `draft`
  - All criteria >= 3 -> `reviewed` (and passes = true)
  - All criteria >= 4 -> `polished`
  - `accepted` is set manually by user/stakeholder, not by evaluator

### 4. Calibration & Comparative Scoring
- After round 1: MUST create `.harness/evaluator-calibration.md` with anchors (score 2/3/4/5 descriptions) for all domain profile criteria
- Every round: reference anchors when scoring, compare against prior round scores
- If a score changes by >1 from the prior round, include explicit justification in `NN-evaluation.md` under a "Score Justification" section
- Every 3 rounds: review and update anchors if project scope has evolved
- Include `justification`, `prior_round_score`, and `drift_check` fields in `NN-evaluation.json` `primary_scores`

### 5. Authenticity Gate (Post-Grading)

After scoring domain criteria and calibrating, apply the Authenticity Gate as a binary pass/fail overlay. This gate catches technically-competent-but-generic output that passed domain scoring.

Check each dimension and record pass/fail + justification in both NN-evaluation.md and NN-evaluation.json:

| Dimension | Verification method |
|-----------|-------------------|
| **internal_consistency** | Do all artifacts share consistent conventions (structure, terminology, style), or do they feel assembled from different sources? Check for convention consistency across all deliverables in the sprint. |
| **intentionality** | Is there evidence of project-specific decisions? Check the builder report "Authenticity self-check" section. Flag: unmodified defaults, generic template output, no documented choices. |
| **craft** | Are the fundamentals correct for each artifact type? Check: consistent structure, clear hierarchy, uniform conventions, correct formatting. Verify against established standards for the deliverable format. |
| **fitness_for_purpose** | Can the target audience use the deliverables without additional explanation? Check for self-contained completeness -- no missing context, no unexplained assumptions. |

Gate rules:
- Each dimension is **binary pass/fail**. There is no partial credit or scoring.
- If **any** dimension fails, the round **FAILS** -- regardless of domain criteria scores. Record the failing dimension(s) and justification.
- The gate runs **after** domain criteria scoring. Domain scores are recorded first; then the authenticity gate is applied as an overlay.
- Record gate results in the authenticity_gate object of NN-evaluation.json (see patterns.md schema).

## Browser Testing

Use Playwright MCP (`mcp__playwright`) or Puppeteer to interact with the running app.
Navigate pages, click buttons, fill forms, take screenshots.
Do NOT rely on reading source code to determine if a feature works -- test it live.

## Feature Completeness Watch

The primary failure mode is "display-only" features -- UI elements that render but
lack interactive depth. For every contract check, verify the feature:
- responds to user interaction (clicks, input, drag)
- persists state correctly (create, edit, delete)
- survives a page reload without losing data

## Feature Acceptance Rule

Only set `passes: true` in `.harness/features.json` after:
- All required contract checks pass
- No primary criterion below 3
- No blocking bug in a core flow
- Evaluation artifact contains reproducible evidence
- The feature's pre-defined `steps[]` from the feature list have been walked through

## Required Outputs Per Round

### First Invocation (Contract Review)
1. `.harness/sprints/NN-contract-review.md` -- before implementation

### Second Invocation (Test + Review + Grade)
2. `.harness/sprints/NN-evaluation.md` -- includes Test Results, Code Review, and Replayable Steps sections
3. `.harness/sprints/NN-evaluation.json` -- structured mirror (primary_scores, contract_checks, feature_evidence, test_results, review_findings)

## Disagreement Rule

If generator and evaluator evidence conflict:

- prefer evaluator-owned acceptance status
- record the disagreement explicitly
- keep the feature failing if a blocking bug remains unresolved

## Do Not

- edit product code
- pass a round on prose confidence alone
- omit replayable steps
