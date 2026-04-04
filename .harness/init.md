# Initialization Documentation

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, features.json (prior cycle), release.json (v2.2.0)
- Status: accepted

## Project Overview

This harness cycle adds script automation to the harness core framework. The project builds `harness-companion.mjs` -- a zero-dependency Node.js ES module script with subcommands that agents call via Bash instead of performing mechanical state management inline. It also fixes a process gap in the evaluator's codex review scope.

Continuing from v2.2.0 (F-001 through F-010 shipped). Feature IDs F-011 through F-014.

## Baseline Verification

Before starting, verify the following:

1. Node.js is available: `node --version` (confirmed v24.14.0)
2. The target scripts directory does not yet exist: `plugins/harness/scripts/` (will be created in Sprint 1)
3. The evaluator role file exists: `plugins/harness/skills/harness/roles/evaluator.md`
4. hooks.json exists at project root level for the harness plugin
5. session.md and coordinator.md exist under roles/

## Setup

No dev server or build process is needed. This project creates Node.js ES module scripts and modifies Markdown role documentation.

To verify the baseline:

```bash
node --version
ls plugins/harness/skills/harness/roles/evaluator.md
ls plugins/harness/skills/harness/roles/coordinator.md
ls plugins/harness/skills/harness/roles/session.md
```

## Features (4 total)

| ID | Title | Priority | Dependencies |
|----|-------|----------|-------------|
| F-011 | Fix evaluator codex scope | high | none |
| F-012 | Build harness-companion.mjs entry point and lib modules | high | none |
| F-013 | Wire scripts into hooks and update role docs | high | F-012 |
| F-014 | End-to-end verification | medium | F-012, F-013 |

## Sprint Plan (2-3 sprints)

1. Sprint 1: F-011 + F-012 -- evaluator codex fix (small edit) + build all scripts (main deliverable). Grouped because F-011 is a single-file edit.
2. Sprint 2: F-013 -- wire scripts into hooks.json, session.md, coordinator.md. Depends on F-012.
3. Sprint 3 (if needed): F-014 -- end-to-end verification or rework from prior failures.

## Technical Notes

- Entry point: `plugins/harness/scripts/harness-companion.mjs`
- Lib modules: `plugins/harness/scripts/lib/{state,features,git,artifacts,progress}.mjs`
- All JSON writes use write-to-temp-then-rename for atomicity
- Zero npm dependencies -- Node.js built-ins only (fs, path, child_process, url)
- JSON to stdout, human-readable errors to stderr
- Exit codes: 0 success, 1 user error, 2 system error

## Artifacts

- `.harness/features.json` -- F-011 through F-014, all starting at passes: false
- `.harness/progress.md` -- current state and next steps
- `.harness/state.json` -- supervised mode, round 1, phase idle, 3 expected sprints
- `.harness/config.json` -- default harness configuration with use_codex: auto
