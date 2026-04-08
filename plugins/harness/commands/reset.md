---
name: reset
description: "Write a structured handoff file and checkpoint the current session. Use when context is filling or work needs to pause. The next /session resumes from the handoff automatically. Implements Variant B (Reset-Based Compatibility)."
allowed_tools: ["Bash", "Read", "Write", "Glob"]
---

# /reset

End the current session cleanly with a structured handoff for the next session.

Run the **Command Pre-Flight Validation** from SKILL.md before proceeding.

## Preconditions

1. Verify `.harness/` exists. If not -> "No harness to reset." STOP.
2. Note: `release.json` and `CHANGELOG.md` live at project root -- they are NOT affected by harness resets.

Read `plugins/harness/skills/harness/references/orchestration.md` section **Reset Procedure** and follow it. That reference contains all procedural steps: Steps 1-8, Phase Resume explanation, and Post-flight.
