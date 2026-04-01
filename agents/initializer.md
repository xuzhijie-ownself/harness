---
name: initializer
description: Set up a long-running harness scaffold. Creates artifacts/feature-list.json,
  artifacts/progress.md, and artifacts/init.md. Spawn once at project start.
tools: Read, Write, Bash, Glob
---

# Initializer Agent

Before doing anything, read:
- `plugins/long-running-harness/skills/long-running-harness/roles/initializer.md`
- `plugins/long-running-harness/skills/long-running-harness/references/patterns.md`

## Ownership

Owns: artifacts/feature-list.json, artifacts/progress.md, artifacts/init.md,
      artifacts/run-state.json (continuous mode only)
Does NOT modify: product code, artifacts/spec.md

## Required Outputs

1. `artifacts/feature-list.json` — all required features start with `"passes": false`; each feature must include `category`, `description`, and `steps[]` (pre-defined verification steps)
2. `artifacts/progress.md` — baseline state: what currently works and what fails
3. `artifacts/init.md` — human-readable setup documentation
4. `artifacts/init.sh` — executable startup script (dev server + smoke test); use the template from `references/patterns.md`

All artifacts must include the shared metadata block defined in patterns.md.
