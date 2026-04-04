# Builder Report

## Metadata
- Role: generator
- Agent: generator-3
- Inputs: accepted contract (03-contract.md), spec.md, features.json
- Status: completed

## Target feature IDs
- F-017 (Per-step metrics)
- F-018 (Structured event logging)

## Implemented

### F-017: lib/metrics.mjs
- Created `plugins/harness/scripts/lib/metrics.mjs` with full JSDoc annotations
- `collectMetrics(round)`: reads git diff --shortstat via spawnSync for file changes, reads NN-evaluation.json for primary_scores
- `recordMetrics(round, metrics)`: writes collected metrics into the matching cost_tracking round entry in state.json via writeState()
- `readMetrics(round)`: reads metrics for a specific round from state.json
- `summarizeMetrics()`: aggregates all rounds -- total_rounds, total_duration_ms, total_file_changes, score_trends (per-criterion arrays), round_details
- Registered `metrics-summary` subcommand in harness-companion.mjs

### F-018: lib/events.mjs
- Created `plugins/harness/scripts/lib/events.mjs` with full JSDoc annotations
- `logEvent({type, round, feature_id, data})`: validates event type, appends a single JSON line with timestamp to .harness/events.jsonl using appendFileSync (no read-modify-write)
- `readEvents(filter?)`: reads events.jsonl, parses each line, filters by type/since/round/feature_id
- `getValidEventTypes()`: returns the list of valid event types
- Event types: agent_spawned, phase_changed, feature_selected, evaluation_completed, commit_made
- Registered `log-event` and `read-events` subcommands in harness-companion.mjs

### harness-companion.mjs updates
- Added imports for metrics.mjs (collectMetrics, summarizeMetrics, recordMetrics, readMetrics)
- Added imports for events.mjs (logEvent, readEvents)
- Added `metrics-summary`, `log-event`, `read-events` to SUBCOMMANDS registry
- `metrics-summary`: no flags needed, outputs aggregated JSON
- `log-event`: --type <type> [--round <n>] [--feature <id>] [--data <json>]
- `read-events`: [--type <filter>] [--since <iso-date>] [--round <n>] [--feature <id>]

## Commands run
- File creation verified via filesystem
- Subcommand registration verified in switch statement

## Self-check
- Both modules follow existing patterns: UserError throws, JSON stdout, zero deps
- All exports have JSDoc @typedef, @param, @returns annotations
- events.mjs uses appendFileSync (no read-modify-write) for crash safety
- metrics.mjs uses spawnSync for git commands (consistent with git.mjs pattern)
- git diff --shortstat regex handles singular/plural forms and missing sections

## Authenticity self-check
- **Internal consistency**: Both modules follow the same patterns as state.mjs, features.mjs, git.mjs -- UserError, harnessDir(), JSDoc typedefs, atomic writes where applicable
- **Intentionality**: Chose appendFileSync over write-tmp-rename for events (append-only semantics); chose to embed metrics in existing cost_tracking structure rather than a separate file
- **Craft**: Consistent naming (camelCase exports, snake_case JSON fields), JSDoc on every export, defensive parsing (try/catch on malformed JSONL lines, fallback zeros for git stats)
- **Fitness for purpose**: Both subcommands produce structured JSON consumable by agents and the postmortem command

## Suggested feature updates
- F-017: should pass if metrics-summary produces valid JSON and collectMetrics returns correct structure
- F-018: should pass if log-event appends to events.jsonl and read-events returns filtered results
