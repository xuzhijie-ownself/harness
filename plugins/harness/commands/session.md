---
name: session
description: Run one supervised sprint round for a harness project.
  Selects the next failing required feature, negotiates a sprint contract with
  evaluator review, implements it, and evaluates it. Waits for user
  confirmation between contract review and implementation.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /session

Run one supervised sprint round (Variant A or B, supervised mode).

Run the **Command Pre-Flight Validation** from SKILL.md before proceeding.

## Script Calls for Mechanical Steps

All mechanical state management steps use `harness-companion.mjs` subcommands instead of inline JSON editing. Run from the project root:

```bash
# Select next eligible feature (highest priority, passes=false, deps met)
node plugins/harness/scripts/harness-companion.mjs feature-select

# Transition sprint phase
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase <phase>
# where <phase> is one of: idle, contract, implementation, evaluation

# Auto-commit after evaluation
node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "feature title" --round N --status pass
# --status is pass or fail

# Validate sprint artifacts exist
node plugins/harness/scripts/harness-companion.mjs validate-artifacts --round N

# Append round summary to progress.md
node plugins/harness/scripts/harness-companion.mjs progress-append --round N --feature F-XXX --status pass --scores '{"product_depth":4,"functionality":4}'

# Check stop conditions
node plugins/harness/scripts/harness-companion.mjs check-stop
```

All subcommands emit JSON to stdout. Parse the output to get structured results. Errors go to stderr with exit code 1 (user error) or 2 (system error).

## Sprint Resume

Before starting fresh, check `.harness/state.json` `current_sprint_phase`:

| Phase | Resume action |
|-------|---------------|
| `idle` | Start a new sprint from step 1 |
| `contract` | Resume at Contract Phase (step 6) -- contract was being negotiated |
| `implementation` | Resume at Implementation Phase (step 9) -- contract was accepted, implementation in progress |
| `evaluation` | Resume at Evaluation Phase (step 10) -- implementation complete, evaluation in progress |

Transition phases using: `node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase <phase>`

## Session Startup

1. Read `.harness/progress.md`.
2. Run `git log --oneline -10` to recover context from recent commits.
3. Check for `.harness/handoff.md` -- if present, read it and resume from `next_step`.
4. Run `bash .harness/init.sh` (or the command from `.harness/init.md`) -- STOP and report if baseline fails.
5. Select the next target feature:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs feature-select
   ```
   If the result has `"eligible": false`, print the blocking reason and STOP.

## Contract Phase

Transition to contract phase:
```bash
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase contract
```

6. Spawn the `generator` agent: "Propose a sprint contract for [feature-id]."
   -> `.harness/sprints/NN-contract.md`
7. Spawn the `evaluator` agent: "Review the contract at .harness/sprints/NN-contract.md."
   -> `.harness/sprints/NN-contract-review.md`
8. Show the contract review to the user.
   - Rejected -> return to step 6 with evaluator feedback.
   - Accepted -> ask user to confirm before proceeding to implementation.

## Implementation Phase

Transition to implementation phase:
```bash
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase implementation
```

9. Spawn the `generator` agent: "Implement the accepted contract at .harness/sprints/NN-contract.md."
   -> code changes + `.harness/sprints/NN-builder-report.md`

## Evaluation Phase

Transition to evaluation phase:
```bash
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase evaluation
```

10. Spawn the `evaluator` agent:
    "Grade the implementation. Contract: NN-contract.md. Builder report: NN-builder-report.md."
    -> `.harness/sprints/NN-evaluation.md`
    -> `.harness/sprints/NN-evaluation.json`
11. Update `.harness/features.json` based on evaluator `feature_evidence`.
12. Append round summary to progress.md:
    ```bash
    node plugins/harness/scripts/harness-companion.mjs progress-append --round N --feature F-XXX --status pass --scores '{"product_depth":4,"functionality":4,"visual_design":4,"code_quality":4}'
    ```
13. Show result to user:
    - **PASS** -> score breakdown + recommended next action.
    - **FAIL** -> specific blockers from evaluation + suggest re-running /session.

Reset phase to idle:
```bash
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase idle
```

## Post-flight

After updating features.json, check stop conditions:
```bash
node plugins/harness/scripts/harness-companion.mjs check-stop
```
If the result shows `"all_required_pass": true`: print "All required features pass. Run `/harness:release` when you are ready to cut a version."

Do NOT auto-spawn the releaser -- the user decides when to release. Multiple sessions may land before the user wants a version bump.

## Auto-Commit

After evaluation completes, use the auto-commit subcommand:
```bash
# PASS:
node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "feature title" --round N --status pass

# FAIL:
node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "feature title" --round N --status fail
```

## Artifact Validation

Before advancing to the next round, validate all required artifacts exist:
```bash
node plugins/harness/scripts/harness-companion.mjs validate-artifacts --round N
```
If any artifacts are missing, STOP and report.

## Session End -- Clean State

Code must be in a mergeable state before the session ends:
- No half-built features left uncommitted
- All tests pass (or known failures are documented)
- Git committed with a descriptive message
- `.harness/progress.md` updated with what changed and what to do next

## Handoff Cleanup

- If `.harness/handoff.md` was read at session start AND session completed successfully -> delete handoff.md
- If handoff.md exists but is for a DIFFERENT feature than current target -> warn user
