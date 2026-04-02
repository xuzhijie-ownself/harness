---
name: harness:init
description: Initialize a harness scaffold for a new project.
  Spawns planner and initializer agents. Run once per project.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /harness:init

Set up the harness scaffold for this project.

## Migration Check
Before proceeding, check if old-format `artifacts/` directory exists:
- If `artifacts/` exists but `.harness/` does not: print "Old format detected. Run /harness:migrate first." and STOP.
- If both exist: print warning but continue (user may be mid-migration).

## Steps

1. Read the current working directory for any existing README or spec.
2. Ask: "Describe your project goal in 1-3 sentences."
2b. Ask: "Choose a development methodology: agile (default), waterfall, scrum, kanban"
    - agile: iterative sprints, backlog-driven, priority-based ordering
    - scrum: time-boxed sprints with planning/review/retro artifacts
    - waterfall: sequential phases (requirements → design → implementation → testing → deploy)
    - kanban: continuous flow, WIP-limited, pull-based
2c. Pass methodology choice to planner agent input
3. Spawn the `planner` agent:
   - Input: user goal + chosen methodology + any existing README context
   - Output: `.harness/spec.md` (must include Execution strategy section)
4. Spawn the `initializer` agent:
   - Input: `.harness/spec.md`
   - Output: `.harness/features.json`, `.harness/progress.md`, `.harness/init.md`
4b. If `.harness/features.json` has >10 required features OR user requested architecture review:
    Spawn the `architect` agent (optional)
    - Input: `.harness/spec.md`, `.harness/features.json`
    - Output: `.harness/architecture.md`
5. Run the command from `.harness/init.md` — confirm baseline passes. STOP if it fails.
6. Show the Execution strategy from `.harness/spec.md` for user confirmation.
7. Print result based on declared execution mode:
   - **supervised**: "Harness ready. Run /harness:session to begin the first sprint."
   - **continuous**: "Harness ready. Run /harness:run to start the coordinator loop."
