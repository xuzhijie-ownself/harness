# Initialization Notes

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, release.json, harness-companion.mjs, lib/*.mjs
- Status: accepted

## Project context

Re-initialization (--force) for harness v2.2.1. The project is a Claude Code plugin providing a structured sprint harness for AI-assisted development. It uses pure Node.js ESM (.mjs) with zero npm dependencies. This cycle hardens the companion script layer, adds missing mutation commands, introduces structured metrics and event logging, and adds a postmortem command.

Target audience: harness plugin developers and AI agents consuming JSON stdout from the companion script.

## What already exists

The companion script layer shipped in v2.2.1:
- `plugins/harness/scripts/harness-companion.mjs` -- main entry with 7 subcommands
- `plugins/harness/scripts/lib/state.mjs` -- state.json read/write
- `plugins/harness/scripts/lib/features.mjs` -- features.json read + selectNextFeature()
- `plugins/harness/scripts/lib/git.mjs` -- autoCommit() via shell exec
- `plugins/harness/scripts/lib/progress.mjs` -- updateTimestamp()
- `plugins/harness/scripts/lib/artifacts.mjs` -- artifact discovery and validation

## Features (5 total)

| ID | Title | Priority | Dependencies | Sprint |
|----|-------|----------|-------------|--------|
| F-015 | Script hardening | high | none | 1 |
| F-016 | Feature-update subcommand | high | F-015 | 1 |
| F-017 | Per-step metrics | medium | F-015 | 2 |
| F-018 | Structured event logging | medium | F-015 | 2 |
| F-019 | Postmortem command | medium | F-017, F-018 | 3 |

## Dependency graph

```
F-015 (Script hardening)
  |
  +-- F-016 (Feature-update subcommand)
  +-- F-017 (Per-step metrics) --------+
  +-- F-018 (Structured event logging) -+-- F-019 (Postmortem command)
```

## Sprint plan (3 sprints)

1. Sprint 1: F-015 + F-016 -- Foundation: hardening enables safe feature mutation
2. Sprint 2: F-017 + F-018 -- Observability: metrics and events, both depend on hardened lib
3. Sprint 3: F-019 -- Postmortem: depends on metrics data and event log

## Setup requirements

- Node.js (ESM support, v14+)
- No npm install needed (zero dependencies)
- Git (for autoCommit functionality)

## Verification

Run the smoke test:
```bash
bash .harness/init.sh
```

Or verify manually:
```bash
node --version
node plugins/harness/scripts/harness-companion.mjs --help
ls plugins/harness/scripts/lib/
```

## Technical notes

- Domain profile: software (product_depth, functionality, visual_design, code_quality)
- visual_design criterion maps to code ergonomics and API surface design for this CLI-only project
- New modules: lib/metrics.mjs, lib/events.mjs
- New subcommands: feature-update, metrics-summary, log-event, read-events (total 11)
- New command file: plugins/harness/commands/postmortem.md
- Simplification policies: F-017 may drop score-trend aggregation; F-019 may drop Recommendations section
