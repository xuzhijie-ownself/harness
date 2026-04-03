# Evaluator Reference

Use this file only for the evaluator role.

## Read

- accepted sprint contract
- builder report
- running app
- `.harness/features.json`
- `.claude/settings.json` (project-level, for Codex detection -- check `enabledPlugins`)
- `~/.claude/settings.json` (user-level global, for Codex detection -- check `extraKnownMarketplaces`)
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

Read config.json `use_codex` value, then decide review mode:
- `"off"` -> review_mode = `"claude"`
- `"on"` -> try `/codex:adversarial-review --wait`; if skill fails, try raw CLI; if both fail, fallback to `"claude"` with fallback_reason
- `"auto"` (default) -> run three checks in order (any-one-passes):
  1. Project `.claude/settings.json` -- `enabledPlugins` contains `"codex@openai-codex": true`
  2. Global `~/.claude/settings.json` -- `extraKnownMarketplaces` contains `"openai-codex"`
  3. `which codex` on PATH -- exits 0
  If any passes -> review_mode = `"codex"`. All three fail -> review_mode = `"claude"`.

When review_mode is `"codex"`, invoke `/codex:adversarial-review --wait` as the primary review method. Fall back to raw CLI if the skill fails. Map findings: critical/high -> BLOCKING, medium/low/info -> NON-BLOCKING.

Record in both NN-evaluation.md and NN-evaluation.json: review_mode, config_use_codex, codex_available, detection_method, detection_result, fallback_reason.

For the detailed 4-step procedure, severity mapping table, and fallback logic, see [references/advanced.md](../references/advanced.md) "Codex Detection Detailed Procedure".

**CRITICAL**: If you skip this pre-flight or default to "claude" without documenting detection, the evaluation is INVALID.

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
- Test via domain-appropriate runtime verification (see the active domain skill for specific tools and procedures), not by reading source code
- Watch for "display-only" features that render but lack interactive depth
- Walk through the feature's pre-defined `steps[]` from `features.json` during evaluation
- After scoring, set feature maturity based on scores:
  - All criteria < 3 -> `draft`
  - All criteria >= 3 -> `reviewed` (and passes = true)
  - All criteria >= 4 -> `polished`
  - `accepted` is set manually by user/stakeholder, not by evaluator

### 4. Calibration & Comparative Scoring
- Persisted calibration file (`.harness/evaluator-calibration.md`) is required only when `expected_sprint_count > 3`. For shorter runs, score with anchors conceptually without persisting them.
- When calibration file is required: create it after round 1 with anchors (score 2/3/4/5 descriptions) for all domain profile criteria. Review and update every 3 rounds.
- Every round: compare against prior round scores. If a score changes by >1, justify in `NN-evaluation.md` under "Score Justification".
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

## Runtime Verification

Use the verification tools and procedures defined by the active domain skill. For software projects, this means interacting with the running application (browser automation, API calls, database checks). For non-software domains (architecture, business analysis, ops), this means validating deliverables against the domain skill's verification strategy (cross-reference checks, notation validation, completeness audits).
Do NOT rely on reading source code or document text alone to determine if a feature works -- verify through the domain-appropriate method.

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
