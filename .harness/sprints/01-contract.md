# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, hooks.json, harness-companion.mjs, lib/events.mjs, lib/state.mjs
- Status: in_review

## Target feature IDs
- F-020
- F-021
- F-022

## Grouping waiver
F-020 and F-021 both modify hooks.json (shared file surface). F-022 adds an independent verification subcommand to harness-companion.mjs. Grouping reduces integration risk for the shared hooks.json and keeps the round count within the expected 2 sprints. All three are individually small and collectively share infrastructure concerns.

## Goal
Add hook-based auto event logging for agent spawns and phase transitions, refine the existing progress-append hook to fire only after evaluation commits, and add a verify-round-numbering subcommand to harness-companion.mjs.

## Deliverables

### F-020: Hook integration for auto event logging
1. Add PostToolUse hook on Agent tool that calls `log-event --type agent_spawned` (id: `post:agent:harness-log-spawn`)
2. Add PostToolUse hook on Bash tool with matcher for `state-mutate --set-phase` that calls `log-event --type phase_changed` (id: `post:bash:harness-log-phase`)
3. Both hooks use the existing events.mjs logEvent() via harness-companion.mjs `log-event` subcommand

### F-021: Enforce progress-append via hooks
1. Refine existing `post:bash:harness-progress-update` hook to add a matcher targeting `auto-commit` with `--status` pattern
2. Update coordinator.md to note that progress-append is hook-automated after evaluation commits
3. Remove or update any manual progress-append guidance for post-evaluation in coordinator.md

### F-022: Round numbering verification subcommand
1. Add `verify-round-numbering` subcommand to SUBCOMMANDS map in harness-companion.mjs
2. Implement handler that reads .harness/sprints/ directory, parses NN prefixes, cross-references against state.json cost_tracking
3. Output: `{ ok: boolean, mismatches: [{file, expected_round, actual_round}], rounds_found: [], rounds_in_state: [] }`

## Verification

### F-020
- FN-020-1: hooks.json contains PostToolUse entry on Agent tool with id `post:agent:harness-log-spawn`
- FN-020-2: hooks.json contains PostToolUse entry on Bash tool with matcher for `state-mutate --set-phase` with id `post:bash:harness-log-phase`
- FN-020-3: Run `log-event --type agent_spawned` and confirm events.jsonl gets an entry
- FN-020-4: Run `log-event --type phase_changed` and confirm events.jsonl gets an entry

### F-021
- FN-021-1: hooks.json `post:bash:harness-progress-update` has a matcher targeting `auto-commit`
- FN-021-2: The hook does NOT match arbitrary Bash invocations (matcher is specific to auto-commit)
- FN-021-3: coordinator.md mentions progress-append is hook-automated
- FN-021-4: coordinator.md step 17 (progress-append) is updated to note hook automation

### F-022
- FN-022-1: `verify-round-numbering` appears in SUBCOMMANDS map
- FN-022-2: Running `verify-round-numbering` returns JSON with `ok` and `mismatches` fields
- FN-022-3: With current empty sprints/ directory, returns `{ ok: true, mismatches: [] }`
- FN-022-4: Subcommand reads .harness/sprints/ and parses NN prefix from filenames

## Acceptance criteria
- Product depth: All three features implement the specified behavior completely (not stubs)
- Functionality: Hooks fire correctly for their target events; subcommand produces correct JSON output
- Visual design: N/A for infrastructure -- maps to documentation clarity and configuration readability
- Code quality: Zero npm dependencies maintained; follows existing ESM patterns; proper error handling

## Contract checks
- `PD-01`: required -- all three features have full implementations, not stubs or placeholders
- `FN-01`: required -- hooks.json contains all specified hook entries with correct structure
- `FN-02`: required -- verify-round-numbering subcommand returns valid JSON
- `VD-01`: advisory -- coordinator.md documentation is clear and consistent
- `CQ-01`: required -- no npm dependencies added; follows existing code patterns in harness-companion.mjs

## Risks
- hooks.json structure may need careful attention to avoid breaking existing hooks
- verify-round-numbering with empty sprints/ directory needs a clean-pass path
