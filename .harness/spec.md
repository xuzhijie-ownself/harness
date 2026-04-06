# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, postmortem recommendations (v2.2.2), hooks.json, harness-companion.mjs, evaluator.md, advanced.md, coordinator.md, release.json, features.json, state.json
- Status: accepted

## Overview

This cycle implements 5 postmortem-driven improvements identified during the v2.2.2 release retrospective. The v2.2.2 cycle exposed gaps in: hook-based automation (event logging requires manual calls; progress-append hook fires too broadly), round numbering verification (off-by-one in sprints/ directory went undetected until postmortem), codex review invocation strategy (skill invocation failed in rounds 2-3 while raw CLI succeeded in round 4), and missing round finalization logic (cost_tracking timestamps left empty when coordinator does not manually fill them). All 5 features are internal harness infrastructure with no user-facing product changes. The target audience is the harness orchestration layer and its operators.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Code (scripts, hooks config), role documentation (Markdown), configuration (JSON)
- Stakeholder lens: Harness operators, coordinator agent, evaluator agent

Note: "visual_design" maps to documentation clarity and configuration readability for this infrastructure cycle.

## Design direction

No visual or UX changes. All work targets internal harness plumbing: hooks.json entries, harness-companion.mjs subcommands, and role file documentation. Maintain the established zero-dependency, pure-Node.js ESM style. New subcommands follow the existing pattern: JSON to stdout, structured errors to stderr, exit codes 0/1/2.

## Shipped scope

### F-020: Hook integration for auto event logging
- Add PostToolUse hook on Agent tool that calls `log-event --type agent_spawned` with agent metadata
- Add PostToolUse hook on Bash tool with matcher for `state-mutate --set-phase` that calls `log-event --type phase_changed`
- Both hooks use the existing events.mjs logEvent() module to append to `.harness/events.jsonl`
- Verification: simulate a sprint flow (agent spawn + phase transition) and confirm events.jsonl contains agent_spawned and phase_changed entries with timestamps

### F-021: Enforce progress-append via hooks
- Refine the existing PostToolUse Bash hook (id: `post:bash:harness-progress-update`) to fire specifically after evaluation-related commits rather than after every Bash invocation
- Add a matcher or condition so it triggers on auto-commit with `--status pass` or `--status fail` patterns
- Update coordinator.md to document that progress-append is hook-automated and remove any manual invocation guidance for post-evaluation progress updates
- Verification: confirm hook definition in hooks.json has appropriate matcher; confirm coordinator.md no longer instructs manual progress-append after evaluation

### F-022: Fix round numbering verification
- Add `verify-round-numbering` subcommand to harness-companion.mjs
- Reads `.harness/sprints/` directory, parses NN prefix from filenames, cross-references against `state.json` cost_tracking round entries
- Reports mismatches as structured JSON: `{ ok: boolean, mismatches: [{file, expected_round, actual_round}] }`
- Register in SUBCOMMANDS map with help text
- Verification: run against current `.harness/sprints/` directory; confirm clean pass or accurate mismatch detection

### F-023: Standardize codex CLI review approach
- Update evaluator.md section "0. Code Review Pre-Flight": when review_mode is "codex", make `codex review --commit HEAD` the primary invocation method
- Move `/codex:adversarial-review --wait` to fallback position (currently it is primary)
- Update advanced.md "Codex Detection Detailed Procedure" section to match the reversed order
- Both files must consistently document: CLI primary, skill invocation as fallback
- Verification: read evaluator.md and advanced.md; confirm CLI is listed before skill invocation in the method ordering

### F-024: Add finalize-round subcommand
- New `finalize-round --round N` subcommand in harness-companion.mjs
- Reads state.json `cost_tracking.rounds[N]` and fills empty string timestamps with current ISO time
- Reads `.harness/sprints/NN-evaluation.json` to extract the `decision` field and sets `outcome` accordingly (PASS -> "pass", FAIL -> "fail")
- Falls back to `--outcome <pass|fail>` CLI flag if evaluation.json is missing or unreadable
- Register in SUBCOMMANDS map with help text
- Update coordinator.md to call `finalize-round --round N` at end of each round
- Verification: run `finalize-round --round 4` against current state.json and confirm empty timestamps in round 4 are populated and outcome is set

## User stories

- As a harness operator, I want agent spawn and phase transition events logged automatically via hooks so I do not need to remember manual log-event calls during orchestration.
- As a coordinator agent, I want progress-append to fire reliably and specifically after evaluation commits so progress.md is always updated without false triggers on unrelated Bash calls.
- As a harness operator, I want a verify-round-numbering subcommand so off-by-one errors in sprint artifact naming are caught early and reported as structured data.
- As an evaluator agent, I want a clear primary/fallback order for codex review (CLI first, skill second) so I do not waste rounds on a failing skill invocation before trying the method that works.
- As a coordinator agent, I want a finalize-round subcommand so cost_tracking timestamps and outcomes are never left empty at the end of a round.

## Execution strategy
- Variant: Variant A (sprinted, single generate-evaluate loop per round)
- Mode: continuous
- Expected sprint count: 2
- Sprint 1 targets: F-020 + F-021 + F-022 -- hooks infrastructure and verification. All three touch hooks.json or harness-companion.mjs. F-020 and F-021 both modify hooks.json; F-022 adds a verification subcommand that validates the numbering fix from v2.2.2. Grouping reduces integration risk for the shared file surface.
- Sprint 2 targets: F-023 + F-024 -- evaluator documentation fix and finalize-round subcommand. Separate concerns from sprint 1. F-023 is a documentation-only change; F-024 adds a new subcommand and coordinator.md update. Both are independent and small enough to batch.
- Default target ordering: within sprint 1, F-020 first (new hooks), F-021 second (refines existing hook), F-022 third (independent verification). Within sprint 2, F-023 first (lower risk doc change), F-024 second (new subcommand).
- Multi-feature sprint policy: grouping is justified per sprint because sprint 1 features share hooks.json and harness-companion.mjs as common file surface, and sprint 2 features are independent but individually small. Grouping waiver required in both contracts.
- Simplification policy: if any feature in a sprint group fails, split the group and retry the failing feature solo in the next round. F-022 may simplify to pass/fail only (drop detailed mismatch array) if JSON formatting proves complex. F-024 may drop automatic evaluation.json reading and require `--outcome` flag as mandatory input instead of optional fallback.
- Methodology: agile

## High-level technical design

### Scripts (harness-companion.mjs)
- F-022: new `verify-round-numbering` subcommand. Reads `.harness/sprints/` via `fs.readdirSync`, extracts NN prefix with regex, compares against cost_tracking rounds in state.json. Outputs `{ ok, mismatches }` JSON.
- F-024: new `finalize-round` subcommand. Reads state.json via `readState()`, finds the target round in cost_tracking.rounds by round number, patches empty timestamps with `new Date().toISOString()`, reads NN-evaluation.json for decision, writes back via `writeState()`. Follows existing atomic write pattern.
- Both registered in SUBCOMMANDS map following the existing `name: description` pattern.

### Hooks (hooks.json)
- F-020: add two new PostToolUse entries:
  - Agent tool hook: calls `log-event --type agent_spawned` (no matcher needed -- fires on all agent spawns)
  - Bash tool hook with matcher for `state-mutate`: calls `log-event --type phase_changed`
- F-021: refine existing `post:bash:harness-progress-update` hook. Add a matcher pattern targeting `auto-commit` invocations so it fires only after evaluation commits, not after arbitrary Bash calls.

### Documentation (role Markdown files)
- F-021: update coordinator.md to note progress-append is hook-automated after evaluation
- F-023: update evaluator.md line 42 area (codex invocation order) and advanced.md codex procedure section -- reverse CLI/skill priority
- F-024: update coordinator.md to include `finalize-round --round N` call in the round-end procedure

### Data/storage
- No new storage formats. events.jsonl, state.json, and features.json are existing artifacts. `.harness/sprints/` directory is read-only for F-022.

## Non-goals
- No changes to the evaluation scoring rubric or criteria weights
- No new domain profiles or skill suites
- No changes to the release process or releaser role
- No modifications to plugin.json manifest or marketplace configuration
- No retrospective automation beyond what the existing postmortem command provides
- No UI, frontend, or user-facing changes
- No npm dependency additions
- No changes to existing lib module APIs (additive only)
- No test framework setup (evaluator agent performs verification)

## Definition of done
- All 5 features (F-020 through F-024) pass evaluation with all primary criteria at 3 or above
- hooks.json contains the new hook entries for agent_spawned and phase_changed event logging, plus the refined progress-append hook
- harness-companion.mjs has both new subcommands (verify-round-numbering, finalize-round) registered and functional with JSON stdout
- evaluator.md and advanced.md consistently document CLI-first codex review with skill as fallback
- coordinator.md reflects hook-automated progress-append and includes finalize-round in round-end procedure
- No regressions in existing subcommands (feature-select, feature-update, state-mutate, auto-commit, validate-artifacts, progress-append, check-stop, cleanup-sprints, metrics-summary, log-event, read-events, postmortem-data)
- Zero npm dependencies maintained
