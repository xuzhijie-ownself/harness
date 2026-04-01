---
name: init
description: Initialize a long-running harness scaffold for a new project.
  Spawns planner and initializer agents. Run once per project.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /init

Set up the long-running harness scaffold for this project.

## Steps

1. Read the current working directory for any existing README or spec.
2. Ask: "Describe your project goal in 1-3 sentences."
3. Spawn the `planner` agent:
   - Input: user goal + any existing README context
   - Output: `artifacts/spec.md` (must include Execution strategy section)
4. Spawn the `initializer` agent:
   - Input: `artifacts/spec.md`
   - Output: `artifacts/feature-list.json`, `artifacts/progress.md`, `artifacts/init.md`
5. Run the command from `artifacts/init.md` — confirm baseline passes. STOP if it fails.
6. Show the Execution strategy from `artifacts/spec.md` for user confirmation.
7. Print result based on declared execution mode:
   - **supervised**: "Harness ready. Run /session to begin the first sprint."
   - **continuous**: "Harness ready. Run /run to start the coordinator loop."
