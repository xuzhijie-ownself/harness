# Initialization Documentation

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, features.json (prior cycle v2.2.1), release.json, harness-companion.mjs, lib/*.mjs
- Status: accepted

## Project Overview

Harness v2.2.2 is an observability and hardening cycle for the harness-companion script layer introduced in v2.2.1. That release delivered 7 subcommands and 5 lib modules with zero npm dependencies. This cycle builds on that foundation in four areas:

1. Script hardening -- JSDoc, runtime validation, circular dependency detection, error handling standardization, git escaping fixes.
2. Feature-update subcommand -- CLI-driven feature mutation to eliminate manual JSON editing.
3. Per-step metrics and structured event logging -- file change counts, evaluation scores in cost_tracking, JSONL event log, metrics-summary and log-event subcommands.
4. Postmortem command and hook integration -- /harness:postmortem command plus hooks wiring for automatic event logging.

Continuing from v2.2.1 (F-011 through F-014 shipped). Feature IDs F-015 through F-020.

## Baseline Verification

Before starting, verify the following:

1. Node.js is available: `node --version`
2. Scripts directory exists: `ls plugins/harness/scripts/harness-companion.mjs`
3. All 5 lib modules exist: `ls plugins/harness/scripts/lib/`
4. Existing subcommands respond: `node plugins/harness/scripts/harness-companion.mjs --help`
5. Harness state files exist: `ls .harness/features.json .harness/state.json`

## Setup

No dev server or build process is needed. This project modifies Node.js ES module scripts and Markdown role/command documentation. Zero npm dependencies are maintained throughout.

To verify the baseline:

```bash
node --version
node plugins/harness/scripts/harness-companion.mjs --help
ls plugins/harness/scripts/lib/
ls .harness/features.json .harness/state.json
```

## Features (6 total)

| ID | Title | Priority | Dependencies | Sprint |
|----|-------|----------|-------------|--------|
| F-015 | Script hardening | high | none | 1 |
| F-016 | Feature-update subcommand | high | F-015 | 1 |
| F-017 | Per-step metrics recording | medium | F-015 | 2 |
| F-018 | Structured event logging | medium | F-015 | 2 |
| F-019 | Postmortem command | medium | F-017, F-018 | 3 |
| F-020 | Hook integration for auto-logging | medium | F-018, F-019 | 4 |

## Sprint Plan (4 sprints)

1. Sprint 1: F-015 + F-016 -- Script hardening (JSDoc, validation, error handling, escaping) paired with feature-update subcommand. Both touch lib modules and the entry point. F-016 depends on standardized error handling from F-015.
2. Sprint 2: F-017 + F-018 -- Per-step metrics paired with structured event logging. Both add new subcommands and lib code. F-018 creates events.mjs which F-017 metrics-summary can reference.
3. Sprint 3: F-019 -- Postmortem command. New command + role file. Depends on metrics and events from F-017/F-018.
4. Sprint 4: F-020 -- Hook integration. Wires log-event into hooks.json and role docs. Depends on F-018 and F-019.

## Technical Notes

- Entry point: `plugins/harness/scripts/harness-companion.mjs` -- gains 3 new subcommands (feature-update, metrics-summary, log-event), total 10
- Existing lib modules (5): state.mjs, features.mjs, git.mjs, artifacts.mjs, progress.mjs -- all get JSDoc and targeted hardening
- New lib module: `plugins/harness/scripts/lib/events.mjs` -- manages .harness/events.jsonl
- New command file: `plugins/harness/commands/postmortem.md`
- New role file: `plugins/harness/skills/harness/roles/postmortem.md`
- Zero dependency constraint maintained throughout
- cost_tracking schema extended with optional file_changes and evaluation_scores (backward compatible)

## Artifacts

- `.harness/features.json` -- F-015 through F-020, all starting at passes: false
- `.harness/progress.md` -- current baseline and next steps
- `.harness/state.json` -- continuous mode, round 1, phase idle, 4 expected sprints
- `.harness/config.json` -- default harness configuration with use_codex: auto
- `.harness/init.sh` -- baseline smoke test (bash)
- `.harness/init.bat` -- baseline smoke test (Windows CMD)
