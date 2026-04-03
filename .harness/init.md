# Initialization Documentation

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, releaser.md, releaser agent stub
- Status: accepted

## Project Overview

This harness run adds a README Sync step to the releaser role. The change is a single Markdown section (~10-15 lines) inserted into the existing releaser role file. No code, no build steps, no tests.

## Baseline Verification

Before starting, verify the following files exist:

1. `plugins/harness/skills/harness/roles/releaser.md` -- the role file to be modified
2. `plugins/harness/agents/releaser.md` -- the agent stub to be verified (should need no changes)
3. `README.md` at project root -- referenced by the new instructions (not modified in this sprint)

## Setup

No dev server or build process is needed. This project modifies Markdown instruction files only.

To verify the baseline:

```bash
ls plugins/harness/skills/harness/roles/releaser.md
ls plugins/harness/agents/releaser.md
```

Both files should exist. The releaser role file should contain sections for Manifest Synchronization and Version Bump Rules. The new README Sync section will be inserted between them.

## Features (1 total)

| ID | Title | Priority | Dependencies |
|----|-------|----------|-------------|
| F-001 | Add README Sync to releaser | high | none |

## Sprint plan (1 sprint)

1. Sprint 1: F-001 -- add README Sync section to releaser role, verify agent stub

## Artifacts

- `.harness/features.json` -- single feature F-001 tracking the README Sync addition
- `.harness/progress.md` -- current state and next steps
- `.harness/state.json` -- continuous mode, round 0, 1 expected sprint
- `.harness/config.json` -- default harness configuration
