# Sprint Proposal

## Metadata
- Role: generator
- Agent: coordinator-generator-1
- Inputs: spec.md, features.json, 02-eval.json
- Status: accepted

## Target feature IDs
- F-030, F-031

## Grouping waiver
Both features modify postmortem-data in harness-companion.mjs. F-031 inlines metrics into the same case block that F-030 adds git log to. Single pass avoids conflicts.

## Goal
Add auto-postmortem with drift detection (F-030). Inline metrics and trim SKILL.md (F-031). After this sprint, lib/metrics.mjs is deleted, postmortem-data uses git log for timeline and inlined metrics, finalize-round detects score drift, and SKILL.md is 100-150 lines shorter.

## Contract checks
- `PD-01` (required): coordinator.md instructs postmortem-data call on completion; releaser.md guards on postmortem.md
- `FN-01` (required): postmortem-data uses git log, finalize-round has drift_warning, metrics inlined
- `VD-01` (required): SKILL.md trimmed by 100+ lines
- `CQ-01` (required): lib/metrics.mjs deleted, no metrics imports, hooks.json has 1 hook
