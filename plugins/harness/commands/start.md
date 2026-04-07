---
name: start
description: "Initialize a harness scaffold for a new project. Spawns planner and initializer agents. Run once per project."
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /start

Set up the harness scaffold for this project.

Run the **Command Pre-Flight Validation** from SKILL.md before proceeding. Note: For `/start`, the `.harness/` directory is not required to exist yet (this command creates it). The validation applies only when `.harness/` already exists (re-init scenario).

## Pre-flight

1. Check if `.harness/` already exists:
   - If yes AND `.harness/state.json` has `"status": "complete"`: allow re-init (new development cycle). Print: "Previous harness completed. Starting fresh cycle."
   - If yes AND status is `"active"` or `"paused"`: WARN "Active harness found. Run /harness:reset first or pass --force to overwrite." STOP unless --force.
2. Check if `release.json` exists at project root -- if yes, read `current_version` so the next release increments correctly. Print: "Found existing release history at v{version}."
3. Verify git repo exists (`git rev-parse --is-inside-work-tree`). If not -> WARN "No git repository. Auto-commit and release features require git."

## Steps

1. Read the current working directory for any existing README or spec.
2. Ask: "Describe your project goal in 1-3 sentences."
3. Ask: "What domain? (software/enterprise_architecture/business_analysis/solution_architecture/ops/custom, default: software)" -- pass this to the planner for the Domain Profile section in spec.md.
4. Spawn the `planner` agent:
   - Input: user goal + domain choice + any existing README context
   - Output: `.harness/spec.md` (must include Execution strategy, Domain Profile, and Security Context sections)

## Spec Review (Interactive)

5. Show spec.md content to the user. At minimum display: Overview, Shipped Scope, Execution Strategy, Security Context.
6. Ask the user:
   - **Approve** -> proceed to step 7
   - **Modify** -> user describes changes. Re-spawn the planner with the original goal + user feedback. Planner rewrites spec.md. Return to step 5.
   - **Start over** -> re-spawn the planner from scratch with the original goal. Return to step 5.

This loop repeats until the user approves. Do NOT proceed to the initializer without explicit approval. If you stop mid-review, resume with `/harness:start` — the planner will re-generate spec.md.

## Scaffold

7. Spawn the `initializer` agent:
   - Input: `.harness/spec.md` (approved by user)
   - Output: `.harness/features.json`, `.harness/progress.md`, `.harness/config.json`, `.harness/init.sh`, `.harness/init.bat`
8. Run `bash .harness/init.sh` -- confirm baseline passes. STOP if it fails. If it fails because it checks for files that no longer exist (stale smoke test), regenerate init.sh and retry.
9. Print result based on declared execution mode:
   - **supervised**: "Harness ready. Run /session to begin the first sprint."
   - **continuous**: "Harness ready. Run /run to start the coordinator loop."
