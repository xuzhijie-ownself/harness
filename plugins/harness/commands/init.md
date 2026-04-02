---
name: init
description: Initialize a harness scaffold for a new project.
  Spawns planner and initializer agents. Run once per project.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /init

Set up the harness scaffold for this project.

## State Validation

Before proceeding:
1. If this command requires `.harness/`: verify directory exists. If not -> "No harness found. Run /harness:init first." STOP.
2. If reading `state.json`: verify it contains `mode`, `variant`, `current_sprint_phase`. If missing fields -> warn and use defaults.
3. If reading `features.json`: verify it's valid JSON with at least one feature. If malformed -> STOP with error.
4. If reading `config.json`: verify it's valid JSON. If missing -> use defaults silently.

Note: For `/init`, the `.harness/` directory is not required to exist yet (this command creates it). The validation above applies only when `.harness/` already exists (re-init scenario).

## Steps

1. Read the current working directory for any existing README or spec.
2. Ask: "Describe your project goal in 1-3 sentences."
3. Ask: "Use Codex for code review? (auto/on/off, default: auto)" -- set this value in `.harness/config.json` `use_codex` field.
4. Ask: "What domain? (software/architecture/tender/research/content/business_analysis/custom, default: software)" -- pass this to the planner for the Domain Profile section in spec.md.
5. Spawn the `planner` agent:
   - Input: user goal + domain choice + any existing README context
   - Output: `.harness/spec.md` (must include Execution strategy and Domain Profile sections)
6. Spawn the `initializer` agent:
   - Input: `.harness/spec.md`
   - Output: `.harness/features.json`, `.harness/progress.md`, `.harness/init.md`, `.harness/config.json`
7. Run the command from `.harness/init.md` -- confirm baseline passes. STOP if it fails.
8. Show the Execution strategy from `.harness/spec.md` for user confirmation.
9. Print result based on declared execution mode:
   - **supervised**: "Harness ready. Run /session to begin the first sprint."
   - **continuous**: "Harness ready. Run /run to start the coordinator loop."
