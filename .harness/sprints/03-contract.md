# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-as-generator (continuous mode)
- Inputs: .harness/spec.md, .harness/features.json, 02-evaluation.json
- Status: in_review

## Target feature IDs
- F-014

## Goal
Run each harness-companion.mjs subcommand against the real harness artifacts (.harness/features.json, .harness/state.json, .harness/sprints/, .harness/progress.md) and verify correct output. This is a verification-only sprint -- no new code is written. The deliverable is evidence that the scripts work end-to-end.

## Deliverables
No code changes. The deliverable is the evaluation report with replayable evidence from running each subcommand.

## Verification

### V-01: feature-select returns valid JSON with dependency resolution
- Run `node plugins/harness/scripts/harness-companion.mjs feature-select`
- Verify JSON output contains feature_id, title, priority, eligible fields
- Verify it selects F-014 (the only remaining passes=false feature with deps met)

### V-02: state-mutate --set-phase updates state.json
- Run `node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase contract`
- Verify state.json `current_sprint_phase` changed to "contract"
- Restore to original value after test

### V-03: state-mutate --increment-round
- Run `node plugins/harness/scripts/harness-companion.mjs state-mutate --increment-round`
- Verify state.json `current_round` incremented
- Restore to original value after test

### V-04: validate-artifacts --round 1
- Run `node plugins/harness/scripts/harness-companion.mjs validate-artifacts --round 1`
- Verify it reports all 5 artifacts as present for round 1
- Run with --round 99 and verify it reports missing artifacts

### V-05: progress-append with full args
- Run `node plugins/harness/scripts/harness-companion.mjs progress-append --round 99 --feature F-TEST --status pass --scores '{"test":5}'`
- Verify progress.md contains the appended section
- Clean up test entry after verification

### V-06: check-stop
- Run `node plugins/harness/scripts/harness-companion.mjs check-stop`
- Verify JSON output with all_required_pass field
- Verify it correctly reports false (F-014 still fails)

### V-07: auto-commit (dry verification)
- Verify auto-commit requires all 4 flags by testing with missing flags (should exit 1)
- Do not actually commit (would dirty git state)

## Acceptance criteria
- Product depth: All 7 subcommands tested against real artifacts
- Functionality: Each subcommand produces correct output with valid inputs and correct errors with invalid inputs
- Visual design (documentation clarity): Evidence is clear and replayable
- Code quality: Test methodology is systematic (valid input, invalid input, edge cases)

## Contract checks
- `PD-01` (required): feature-select returns valid JSON with correct dependency resolution
- `PD-02` (required): state-mutate updates state.json fields correctly
- `FN-01` (required): validate-artifacts correctly identifies present and missing artifacts
- `FN-02` (required): progress-append produces well-formed entry
- `FN-03` (required): check-stop returns correct stop-condition analysis
- `VD-01` (required): All evidence is captured with exact command and output
- `CQ-01` (required): Error paths tested (missing flags produce exit code 1)

## Risks
- Running state-mutate and progress-append against real artifacts will modify them -- tests must restore original state
- auto-commit cannot be fully tested without making actual git commits
