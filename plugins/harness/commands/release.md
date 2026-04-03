---
name: release
description: Create a release checkpoint -- version bump, changelog, and git tag.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /release

Create a release checkpoint -- version bump, changelog, and git tag.

Run the **Command Pre-Flight Validation** from SKILL.md before proceeding.

## Pre-flight

1. Read `.harness/features.json` -- verify ALL required features have `passes: true`
   - If any required feature has `passes: false`: REFUSE. Print: "Cannot release: features [F-XXX, F-YYY] are still failing."
2. Read existing `release.json` (project root) if it exists:
   - Check if the latest release already shipped the same feature set -> warn about double-release
3. Verify git working tree is clean (`git status --porcelain` is empty)
   - If dirty: WARN "Uncommitted changes. Commit or stash before releasing."

## When to Use
- After all required features pass (automatic via coordinator)
- Manually when you want to cut a release mid-run
- Before starting a new development cycle

## Steps

1. Read `.harness/features.json` -- count passing features
2. Read `.harness/state.json` -- get sprint count
3. Spawn the `releaser` agent
4. Print release summary: version, features shipped, changelog preview
5. Confirm git tag was created
6. Verify `release.json` exists at project root
7. Verify `CHANGELOG.md` exists at project root
