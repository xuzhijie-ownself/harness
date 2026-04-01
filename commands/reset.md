---
name: reset
description: Write a structured handoff file and checkpoint the current session.
  Use when context is filling or work needs to pause. The next /session resumes
  from the handoff automatically. Implements Variant B (Reset-Based Compatibility).
allowed_tools: ["Bash", "Read", "Write", "Glob"]
---

# /reset

End the current session cleanly with a structured handoff for the next session.

## When to Use

- Context is ~75% full
- The model is prematurely wrapping up features (context anxiety)
- Work needs to pause and resume in a new Claude Code session

Context resets with a structured handoff are more reliable than compaction for
long sessions. Models exhibit "context anxiety" — premature closure as context fills.
(Source: Anthropic engineering, March 2026)

## Steps

1. Run `git diff --name-only HEAD` — list all modified files.
2. Read `artifacts/feature-list.json` — identify current `in_progress` feature.
3. Read `artifacts/progress.md` — identify last completed step.
4. Write `artifacts/handoff.md` using the template from
   `plugins/long-running-harness/skills/long-running-harness/references/patterns.md`.
   The handoff must include:
   - Current feature ID and title
   - Last completed step (one sentence)
   - Modified files (from git diff)
   - Open questions or blockers
   - Next step (single sentence — the first thing the next session should do)
5. Stage and commit work in progress:
   `git commit -m "wip(F00X): session checkpoint — <brief description>"`
6. Update `artifacts/progress.md` — record session end and reference to handoff.
7. Print: "Handoff written to artifacts/handoff.md. Start a new session and run
   /session to resume."
