---
name: harness:reset
description: Write a structured handoff file and checkpoint the current session.
  Use when context is filling or work needs to pause. The next /harness:session resumes
  from the handoff automatically. Implements Variant B (Reset-Based Compatibility).
allowed_tools: ["Bash", "Read", "Write", "Glob"]
---

# /harness:reset

End the current session cleanly with a structured handoff for the next session.

## Migration Check
Before proceeding, check if old-format `artifacts/` directory exists:
- If `artifacts/` exists but `.harness/` does not: print "Old format detected. Run /harness:migrate first." and STOP.
- If both exist: print warning but continue (user may be mid-migration).

## When to Use

- Context is ~75% full
- The model is prematurely wrapping up features (context anxiety)
- Work needs to pause and resume in a new Claude Code session

Context resets with a structured handoff are more reliable than compaction for
long sessions. Models exhibit "context anxiety" — premature closure as context fills.
(Source: Anthropic engineering, March 2026)

## Steps

1. Run `git diff --name-only HEAD` — list all modified files.
2. Read `.harness/features.json` — identify current `in_progress` feature.
3. Read `.harness/progress.md` — identify last completed step.
4. Write `.harness/handoff.md` using the template from
   `plugins/harness/skills/harness/references/patterns.md`.
   The handoff must include:
   - Current feature ID and title
   - Last completed step (one sentence)
   - Modified files (from git diff)
   - Open questions or blockers
   - Next step (single sentence — the first thing the next session should do)
5. Stage and commit work in progress:
   `git commit -m "wip(F00X): session checkpoint — <brief description>"`
6. Update `.harness/progress.md` — record session end and reference to handoff.
7. Print: "Handoff written to .harness/handoff.md. Start a new session and run
   /harness:session to resume."
