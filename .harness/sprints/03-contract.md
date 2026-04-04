# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-3
- Inputs: .harness/spec.md, .harness/features.json, 02-evaluation.json
- Status: in_review

## Target feature IDs
- F-017 (Per-step metrics)
- F-018 (Structured event logging)

## Grouping waiver
F-017 and F-018 are both observability features that depend only on F-015 (now passing). They are independent of each other but tightly coupled in purpose: metrics provides numeric data, events provides a timeline. Grouping reduces integration risk and enables F-019 (postmortem) to be unblocked in a single subsequent round rather than two.

## Goal
Add two new lib modules (metrics.mjs, events.mjs) and their corresponding subcommands to harness-companion.mjs. After this sprint, the coordinator has structured per-round metrics and an append-only event log available for observability and postmortem analysis.

## Deliverables

### F-017: Per-step metrics
- `plugins/harness/scripts/lib/metrics.mjs` with:
  - `collectMetrics(round)` -- reads git diff --shortstat for file changes, reads NN-evaluation.json for scores, returns structured metrics object
  - `summarizeMetrics()` -- reads all rounds from state.json cost_tracking, aggregates totals
- `metrics-summary` subcommand registered in harness-companion.mjs
- JSDoc annotations on all exports
- Zero npm dependencies

### F-018: Structured event logging
- `plugins/harness/scripts/lib/events.mjs` with:
  - `logEvent({type, round, feature_id, data})` -- appends JSON line to .harness/events.jsonl
  - `readEvents(filter)` -- reads and optionally filters events by type and/or date
- `log-event` subcommand: --type <type> --round <N> --feature <id> [--data <json>]
- `read-events` subcommand: [--type <filter>] [--since <iso-date>]
- Event types: agent_spawned, phase_changed, feature_selected, evaluation_completed, commit_made
- JSDoc annotations, zero deps

## Verification

### F-017 checks
- PD-17: Run `node harness-companion.mjs metrics-summary` and verify JSON output with aggregated metrics
- FN-17: Verify collectMetrics() returns {round, file_changes, evaluation_scores}
- CQ-17: Verify JSDoc on all exports, zero deps, atomic writes via writeState()

### F-018 checks
- PD-18: Run `log-event --type agent_spawned --round 3 --feature F-017 --data '{}'` and verify events.jsonl appended
- FN-18: Run `read-events --type agent_spawned` and verify filtered JSON array output
- CQ-18: Verify append-only behavior (no read-modify-write), JSDoc on all exports

## Acceptance criteria
- Product depth: metrics aggregation and event timeline provide actionable observability data
- Functionality: all subcommands produce correct JSON output, events.jsonl is append-only
- Visual design: N/A for CLI modules (JSON output is well-structured)
- Code quality: JSDoc annotations, zero deps, follows existing patterns, atomic writes

## Contract checks
- `PD-01`: (required) metrics-summary outputs valid JSON with total_rounds, total_file_changes, score_trends
- `FN-01`: (required) collectMetrics returns correct structure; logEvent appends correctly
- `FN-02`: (required) readEvents filters by type and date correctly
- `VD-01`: (advisory) JSON output is consistent with existing subcommand output format
- `CQ-01`: (required) JSDoc on all exports; zero npm deps; atomic writes for state mutations

## Risks
- git diff --shortstat parsing may vary across git versions (mitigate: use regex with flexible whitespace)
- events.jsonl concurrent writes are unlikely in single-agent CLI usage but could cause partial lines in theory (mitigate: write complete lines with newline)
