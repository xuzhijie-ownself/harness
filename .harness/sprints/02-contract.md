# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, 01-evaluation.json, evaluator.md, advanced.md, harness-companion.mjs, coordinator.md
- Status: in_review

## Target feature IDs
- F-023
- F-024

## Grouping waiver
F-023 is a documentation-only change (evaluator.md and advanced.md). F-024 adds a new subcommand to harness-companion.mjs and updates coordinator.md. Both are independent and individually small. Grouping keeps the run within the expected 2-sprint budget.

## Goal
Standardize codex CLI review ordering (CLI primary, skill fallback) in evaluator and advanced docs, and add a finalize-round subcommand that fills cost_tracking timestamps and outcomes.

## Deliverables

### F-023: Standardize codex CLI review approach
1. Edit evaluator.md section "0. Code Review Pre-Flight" to make `codex review --commit HEAD` the primary invocation method when review_mode is "codex"
2. Move `/codex:adversarial-review --wait` to fallback position in evaluator.md
3. Edit advanced.md "Codex Detection Detailed Procedure" Step 3 to reverse the ordering: CLI primary, skill fallback
4. Both files must consistently document CLI primary, skill fallback

### F-024: Add finalize-round subcommand
1. Add `finalize-round` to SUBCOMMANDS map in harness-companion.mjs
2. Implement handler: reads state.json cost_tracking.rounds, finds round N, fills empty timestamps with current ISO time
3. Reads .harness/sprints/NN-evaluation.json for decision field to set outcome (PASS -> "pass", FAIL -> "fail")
4. Falls back to --outcome flag if evaluation.json is missing or unreadable
5. Uses writeState() for atomic write
6. Update coordinator.md to call finalize-round --round N at end of each round

## Verification

### F-023
- FN-023-1: evaluator.md lists `codex review --commit HEAD` as primary method when review_mode is codex
- FN-023-2: evaluator.md lists `/codex:adversarial-review --wait` as fallback
- FN-023-3: advanced.md Step 3 lists CLI before skill invocation
- FN-023-4: No contradictory ordering in either file

### F-024
- FN-024-1: `finalize-round` appears in SUBCOMMANDS map
- FN-024-2: Running `finalize-round --round 1` fills empty timestamps
- FN-024-3: Reads NN-evaluation.json for decision field
- FN-024-4: --outcome flag works as fallback
- FN-024-5: coordinator.md includes finalize-round in round-end procedure
- FN-024-6: Uses writeState() for atomic writes

## Acceptance criteria
- Product depth: Both features complete the specified behavior (not stubs)
- Functionality: CLI-first ordering consistent in both docs; finalize-round populates timestamps correctly
- Visual design: Documentation is clear, no contradictory guidance
- Code quality: Zero npm dependencies; follows existing subcommand patterns

## Contract checks
- `PD-01`: required -- both features fully implemented
- `FN-01`: required -- evaluator.md and advanced.md consistently show CLI primary, skill fallback
- `FN-02`: required -- finalize-round --round N fills timestamps and reads outcome from evaluation.json
- `VD-01`: advisory -- documentation is clear and no contradictory ordering
- `CQ-01`: required -- no npm dependencies; follows existing patterns

## Risks
- evaluator.md has multiple codex-related sections that all need consistent updates
- finalize-round needs to handle the case where round N does not exist in cost_tracking
