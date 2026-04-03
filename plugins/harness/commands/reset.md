---
name: reset
description: Write a structured handoff file and checkpoint the current session.
  Use when context is filling or work needs to pause. The next /session resumes
  from the handoff automatically. Implements Variant B (Reset-Based Compatibility).
allowed_tools: ["Bash", "Read", "Write", "Glob"]
---

# /reset

End the current session cleanly with a structured handoff for the next session.

Run the **Command Pre-Flight Validation** from SKILL.md before proceeding.

## Pre-flight

1. Verify `.harness/` exists. If not -> "No harness to reset." STOP.
2. Note: `release.json` and `CHANGELOG.md` live at project root -- they are NOT affected by harness resets.

## When to Use

- Context is ~75% full
- The model is prematurely wrapping up features (context anxiety)
- Work needs to pause and resume in a new Claude Code session

Context resets with a structured handoff are more reliable than compaction for
long sessions. Models exhibit "context anxiety" -- premature closure as context fills.
(Source: Anthropic engineering, March 2026)

## Steps

1. Run `git diff --name-only HEAD` -- list all modified files.
2. Read `.harness/features.json` -- identify current `in_progress` feature.
3. Read `.harness/progress.md` -- identify last completed step.
4. Write `.harness/handoff.md` using the template from
   `plugins/harness/skills/harness/references/patterns.md`.
   The handoff must include:
   - Current feature ID and title
   - Last completed step (one sentence)
   - Modified files (from git diff)
   - Open questions or blockers
   - Next step (single sentence -- the first thing the next session should do)
5. Stage and commit work in progress:
   `git commit -m "wip(F00X): session checkpoint -- <brief description>"`
6. Update `.harness/progress.md` -- record session end and reference to handoff.
7. Print: "Handoff written to .harness/handoff.md. Start a new session and run
   /session to resume."

## Post-flight

1. Update `.harness/state.json`: set `status` to `"paused"`, set `stop_reason` to `"context reset via /reset"`
2. Verify `.harness/handoff.md` was created and contains: current feature, last step, modified files, next step
