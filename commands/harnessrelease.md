---
name: harness:release
description: Create a release checkpoint — version bump, changelog, and git tag.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /harness:release

Create a release checkpoint — version bump, changelog, and git tag.

## Migration Check
Before proceeding, check if old-format `artifacts/` directory exists:
- If `artifacts/` exists but `.harness/` does not: print "Old format detected. Run /harness:migrate first." and STOP.
- If both exist: print warning but continue (user may be mid-migration).

## When to Use
- After all required features pass (automatic via coordinator)
- Manually when you want to cut a release mid-run
- Before starting a new development cycle

## Steps

1. Read `.harness/features.json` — count passing features
2. Read `.harness/state.json` — get sprint count
3. Spawn the `releaser` agent
4. Print release summary: version, features shipped, changelog preview
5. Confirm git tag was created
