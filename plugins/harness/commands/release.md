---
name: release
description: Create a release checkpoint — version bump, changelog, and git tag.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /release

Create a release checkpoint — version bump, changelog, and git tag.

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
