---
name: initializer
description: Set up a harness scaffold. Creates .harness/features.json,
  .harness/progress.md, and .harness/init.sh. Spawn once at project start.
tools: Read, Write, Bash, Glob
---

# Initializer Agent

> Thin wrapper -- edit `plugins/harness/skills/harness/roles/initializer.md` instead.

Before doing anything, read these files in order:
1. `plugins/harness/skills/harness/roles/initializer.md` -- full role instructions
2. `plugins/harness/skills/harness/references/patterns.md` -- artifact schemas

Follow all instructions in the role file. The role file is the single source of truth.

## Ownership

Owns: .harness/features.json, .harness/progress.md, .harness/state.json
Does NOT modify: product code, .harness/spec.md
