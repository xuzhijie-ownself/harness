---
name: initializer
description: Set up a harness scaffold. Creates .harness/features.json,
  .harness/progress.md, and .harness/init.md. Spawn once at project start.
tools: Read, Write, Bash, Glob
---

# Initializer Agent

Before doing anything, read:
- `plugins/harness/skills/harness/roles/initializer.md`
- `plugins/harness/skills/harness/references/patterns.md`

## Ownership

Owns: .harness/features.json, .harness/progress.md, .harness/init.md,
      .harness/state.json (continuous mode only)
Does NOT modify: product code, .harness/spec.md

## Required Outputs

1. `.harness/features.json` — all required features start with `"passes": false`; each feature must include `category`, `description`, and `steps[]` (pre-defined verification steps)
2. `.harness/progress.md` — baseline state: what currently works and what fails
3. `.harness/init.md` — human-readable setup documentation
4. `.harness/init.sh` — executable startup script (dev server + smoke test); use the template from `references/patterns.md`
5. `.harness/test-plan.md` — generated from the spec's feature list; use the template from `references/patterns.md`; populate per-feature test requirements (unit, integration, e2e) based on feature type

All artifacts must include the shared metadata block defined in patterns.md.
