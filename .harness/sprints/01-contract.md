# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-generator-1
- Inputs: .harness/spec.md, .harness/features.json, harness-companion.mjs, hooks.json, evaluator.md, advanced.md, patterns.md
- Status: in_review

## Target feature IDs
- F-025, F-026, F-027

## Grouping waiver
All three features share the same primary edit surface (harness-companion.mjs) and are independent removals. Grouping them into a single sprint avoids three separate import/dispatch rewrites of the same file and reduces merge-conflict risk.

## Goal
Remove three accumulated subsystems: the events system (F-025), codex detection ceremony (F-026), and three unused subcommands (F-027). After this sprint, harness-companion.mjs will have ~11 subcommands (down from 15), hooks.json will have 1 hook (down from 3), and the evaluator will use a runtime-agnostic code review note instead of mandatory codex pre-flight.

## Deliverables

### F-025: Remove events system
1. Delete `plugins/harness/scripts/lib/events.mjs`
2. Remove `import { logEvent, readEvents } from './lib/events.mjs'` from harness-companion.mjs
3. Remove `log-event` and `read-events` from SUBCOMMANDS map
4. Remove case blocks for `log-event` and `read-events`
5. Remove 2 event hooks from hooks.json (keep only `post:bash:harness-progress-update`)
6. Remove events.jsonl references from `postmortem-data` case block
7. Remove events.jsonl references from postmortem.md command file
8. Delete .harness/events.jsonl if it exists

### F-026: Remove codex detection from evaluator
1. In evaluator.md: Remove Section 0 "Code Review Pre-Flight (MANDATORY)" entirely
2. In evaluator.md: Add 2-line runtime-agnostic note replacing removed content
3. In evaluator.md: Remove codex references from Read section and Code Review subsection
4. In advanced.md: Remove "Codex Detection Detailed Procedure" section (lines 96-end)
5. In patterns.md: Remove `codex_detection` object from `review_findings` in NN-evaluation.json schema
6. In patterns.md: Simplify `review_findings` to `{ "review_mode", "blocking", "non_blocking" }`
7. In patterns.md: Remove `use_codex` field from config.json schema
8. In coordinator.md: Remove "Codex Detection Enforcement" section
9. In SKILL.md: Remove codex detection paragraph from Evaluator section
10. In session.md: No codex references to remove (confirmed clean)

### F-027: Remove unused subcommands
1. Remove `feature-update` from SUBCOMMANDS map and its case block
2. Remove `verify-round-numbering` from SUBCOMMANDS map and its case block
3. Remove `metrics-summary` from SUBCOMMANDS map and its case block
4. Remove `import { ..., updateFeature } from './lib/features.mjs'` named import
5. Remove `updateFeature()` and `writeFeatures()` exports from lib/features.mjs
6. Keep metrics.mjs import for now (postmortem-data still calls summarizeMetrics)

## Verification
- `node plugins/harness/scripts/harness-companion.mjs --help` runs without error and shows ~11 subcommands
- `node plugins/harness/scripts/harness-companion.mjs feature-select` still works
- `node plugins/harness/scripts/harness-companion.mjs check-stop` still works
- `grep -r "events.mjs" plugins/harness/scripts/` returns no matches
- `grep -r "log-event\|read-events" plugins/harness/scripts/harness-companion.mjs` returns no matches
- `grep -r "codex_detection" plugins/harness/` returns no matches in active code
- `grep -r "feature-update\|verify-round-numbering\|metrics-summary" plugins/harness/scripts/harness-companion.mjs` returns no matches in SUBCOMMANDS
- hooks.json has exactly 1 hook entry
- lib/events.mjs does not exist
- lib/features.mjs has no updateFeature or writeFeatures exports

## Acceptance criteria
- Product depth: All three subsystems fully removed with no orphaned references
- Functionality: Remaining subcommands work correctly (feature-select, check-stop, auto-commit, etc.)
- Visual design: Documentation clarity maintained -- codex removal replaced with concise runtime-agnostic note
- Code quality: No dead imports, no unreachable case blocks, no orphaned hook entries

## Contract checks
- `PD-01` (required): Zero references to events.mjs, log-event, read-events, events.jsonl in active code
- `FN-01` (required): harness-companion.mjs runs --help without error and remaining subcommands produce valid JSON
- `VD-01` (required): evaluator.md codex pre-flight replaced with 2-line note; no codex detection in coordinator.md
- `CQ-01` (required): No dead imports in harness-companion.mjs; features.mjs has no updateFeature/writeFeatures

## Risks
- postmortem-data case block references both events and metrics; removing events requires updating the JSON output shape
- Coordinator.md codex enforcement section removal must not accidentally remove other enforcement sections
