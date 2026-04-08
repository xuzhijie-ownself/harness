---
name: reset
description: "Write a structured handoff file and checkpoint the current session. Use when context is filling or work needs to pause. The next /session resumes from the handoff automatically. Implements Variant B (Reset-Based Compatibility)."
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
- Work needs to pause and resume in a new session

Context resets with a structured handoff are more reliable than compaction for
long sessions. Models exhibit "context anxiety" -- premature closure as context fills.
(Source: Anthropic engineering, March 2026)

## Steps

1. Run `git diff --name-only HEAD` -- list all modified files.
2. Identify the current feature:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs feature-select
   ```
   Use the returned `feature_id` and `title` for the handoff.
3. Read `.harness/progress.md` -- identify last completed step.
4. Read `.harness/state.json` `current_sprint_phase` -- record which phase was interrupted.
5. Write `.harness/handoff.md` using the template from
   `plugins/harness/skills/harness/references/patterns.md`.
   The handoff must include:
   - Current feature ID and title
   - Last completed step (one sentence)
   - Interrupted phase (idle/contract/implementation/evaluation)
   - Modified files (from git diff)
   - Open questions or blockers
   - Next step (single sentence -- the first thing the next session should do)
6. Stage and commit work in progress:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "session checkpoint" --round N --status fail
   ```
7. Update progress.md:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs progress-append --round N --feature F-XXX --status paused --scores '{}'
   ```
8. Print: "Handoff written to .harness/handoff.md. Start a new session and run /session to resume."

## Phase Resume (How /session Uses the Handoff)

When `/session` starts and finds `.harness/handoff.md`:
1. Read `current_sprint_phase` from `state.json`
2. Resume at the interrupted phase:
   - `idle` -> start fresh (handoff was written between sprints)
   - `contract` -> re-propose or re-review the contract
   - `implementation` -> re-run implementation (prior attempt may be partial)
   - `evaluation` -> re-run evaluation on existing implementation
3. Delete `handoff.md` after successful sprint completion

## Post-flight

1. Update state.json:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase idle
   ```
   Then manually set `status` to `"paused"` and `stop_reason` to `"context reset via /reset"` in state.json.
2. Verify `.harness/handoff.md` was created and contains: current feature, last step, interrupted phase, modified files, next step
