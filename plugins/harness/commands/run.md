---
name: run
description: Run the harness in continuous coordinator-driven mode.
  Advances sprint rounds automatically until all required features pass or a blocker
  stops the run. Use when you want unattended progress.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /run

Run the harness in continuous coordinator-driven mode (Variant A, continuous mode).

## State Validation

Before proceeding:
1. If this command requires `.harness/`: verify directory exists. If not -> "No harness found. Run /harness:init first." STOP.
2. If reading `state.json`: verify it contains `mode`, `variant`, `current_sprint_phase`. If missing fields -> warn and use defaults.
3. If reading `features.json`: verify it's valid JSON with at least one feature. If malformed -> STOP with error.
4. If reading `config.json`: verify it's valid JSON. If missing -> use defaults silently.

## Preconditions

Verify before spawning coordinator:
- `.harness/spec.md` exists -- if not, run `/init` first.
- `.harness/features.json` exists with at least one `passes: false` required feature.
- Execution mode in `.harness/spec.md` is `continuous`.

If execution mode is `supervised`, redirect the user to `/session` instead.

## Steps

1. Read `.harness/spec.md` -- confirm execution mode is `continuous`.
2. Read `.harness/features.json` -- count failing required features.
3. Print: "Starting continuous run. [N] required features failing. Coordinator will
   advance rounds automatically."
4. Spawn the `coordinator` agent -- it runs its internal loop until stop conditions are met.
5. When coordinator stops:
   - **Completion** -> print final summary from `.harness/summary.md`.
   - **Blocker** -> print `stop_reason` from `.harness/state.json` and suggest
     the next action for the user.
