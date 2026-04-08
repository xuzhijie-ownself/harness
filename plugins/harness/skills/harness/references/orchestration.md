# Orchestration Procedures

Shared procedural reference for `/session` and `/reset` commands. Both commands are thin wrappers that point here.

## Session Procedure

### Script Calls for Mechanical Steps

All mechanical state management steps use `harness-companion.mjs` subcommands instead of inline JSON editing. Run from the project root:

```bash
# Select next eligible feature (highest priority, passes=false, deps met)
node plugins/harness/scripts/harness-companion.mjs feature-select

# Transition sprint phase
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase <phase>
# where <phase> is one of: idle, contract, implementation, evaluation

# Auto-commit after evaluation
node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "feature title" --round N --status pass

# Validate sprint artifacts exist
node plugins/harness/scripts/harness-companion.mjs validate-artifacts --round N

# Append round summary to progress.md
node plugins/harness/scripts/harness-companion.mjs progress-append --round N --feature F-XXX --status pass --scores '{"product_depth":4,"functionality":4}'

# Check stop conditions
node plugins/harness/scripts/harness-companion.mjs check-stop
```

### Sprint Resume

Before starting fresh, check `.harness/state.json` `current_sprint_phase`:

| Phase | Resume action |
|-------|---------------|
| `idle` | Start a new sprint from step 1 |
| `contract` | Resume at Contract Phase (step 6) |
| `implementation` | Resume at Implementation Phase (step 11) |
| `evaluation` | Resume at Evaluation Phase (step 12) |

Transition phases using: `node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase <phase>`

### Session Startup

1. Read `.harness/progress.md`.
2. Run `git log --oneline -10` to recover context from recent commits.
3. Check for `.harness/handoff.md` -- if present, read it and resume from `next_step`.
4. Run `bash .harness/init.sh` -- STOP and report if baseline fails. If it fails because it checks for files that no longer exist (stale smoke test), regenerate init.sh and retry.
5. Select the next target feature:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs feature-select
   ```
   If the result has `"eligible": false`, print the blocking reason and STOP.

### Contract Phase

Transition to contract phase:
```bash
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase contract
```

6. Spawn the `generator` agent: "Propose a sprint contract for [feature-id]."
   -> `.harness/sprints/NN-proposal.md`

#### Contract Review (Interactive)

7. Show the proposal to the user. At minimum display: Goal, Deliverables, Verification, Contract Checks.
8. Ask the user:
   - **Approve contract** -> proceed to step 9
   - **Modify** -> user describes changes. Re-spawn the generator with the original feature + user feedback. Generator rewrites NN-proposal.md. Return to step 7.
   - **Re-propose** -> re-spawn the generator from scratch for the same feature. Return to step 7.

This loop repeats until the user approves. Do NOT send to the evaluator without explicit user approval. If you stop mid-review, the phase stays at `contract`. Resume with `/harness:session` to continue from step 6.

9. Spawn the `evaluator` agent: "Review the contract at .harness/sprints/NN-proposal.md."
   -> `.harness/sprints/NN-review.md`
10. Show the evaluator's review to the user.
    - Rejected -> return to step 6 with evaluator feedback.
    - Accepted -> proceed to implementation.

### Implementation Phase

Transition to implementation phase:
```bash
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase implementation
```

11. Spawn the `generator` agent: "Implement the accepted contract at .harness/sprints/NN-proposal.md."
    -> code changes + `.harness/sprints/NN-report.md`

### Evaluation Phase

Transition to evaluation phase:
```bash
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase evaluation
```

12. Spawn the `evaluator` agent:
    "Grade the implementation. Contract: NN-proposal.md. Builder report: NN-report.md."
    -> `.harness/sprints/NN-eval.md`
    -> `.harness/sprints/NN-eval.json`
13. Update `.harness/features.json` based on evaluator `feature_evidence`.
14. Append round summary to progress.md:
    ```bash
    node plugins/harness/scripts/harness-companion.mjs progress-append --round N --feature F-XXX --status pass --scores '{"product_depth":4,"functionality":4,"visual_design":4,"code_quality":4}'
    ```
15. Show result to user:
    - **PASS** -> score breakdown + recommended next action.
    - **FAIL** -> specific blockers from evaluation + suggest re-running /session.

Reset phase to idle:
```bash
node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase idle
```

### Post-flight

After updating features.json, check stop conditions:
```bash
node plugins/harness/scripts/harness-companion.mjs check-stop
```
If the result shows `"all_required_pass": true`: print "All required features pass. Run `/harness:release` when you are ready to cut a version."

Do NOT auto-spawn the releaser -- the user decides when to release.

### Auto-Commit

After evaluation completes, use the auto-commit subcommand:
```bash
# PASS:
node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "feature title" --round N --status pass

# FAIL:
node plugins/harness/scripts/harness-companion.mjs auto-commit --feature F-XXX --title "feature title" --round N --status fail
```

### Artifact Validation

Before advancing to the next round, validate all required artifacts exist:
```bash
node plugins/harness/scripts/harness-companion.mjs validate-artifacts --round N
```
If any artifacts are missing, STOP and report.

### Session End -- Clean State

Code must be in a mergeable state before the session ends:
- No half-built features left uncommitted
- All tests pass (or known failures are documented)
- Git committed with a descriptive message
- `.harness/progress.md` updated with what changed and what to do next

### Handoff Cleanup

- If `.harness/handoff.md` was read at session start AND session completed successfully -> delete handoff.md
- If handoff.md exists but is for a DIFFERENT feature than current target -> warn user

## Reset Procedure

### Pre-flight

1. Verify `.harness/` exists. If not -> "No harness to reset." STOP.
2. Note: `release.json` and `CHANGELOG.md` live at project root -- they are NOT affected by harness resets.

### When to Use

- Context is ~75% full
- The model is prematurely wrapping up features (context anxiety)
- Work needs to pause and resume in a new session

Context resets with a structured handoff are more reliable than compaction for
long sessions. Models exhibit "context anxiety" -- premature closure as context fills.
(Source: Anthropic engineering, March 2026)

### Steps

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

### Phase Resume (How /session Uses the Handoff)

When `/session` starts and finds `.harness/handoff.md`:
1. Read `current_sprint_phase` from `state.json`
2. Resume at the interrupted phase:
   - `idle` -> start fresh (handoff was written between sprints)
   - `contract` -> re-propose or re-review the contract
   - `implementation` -> re-run implementation (prior attempt may be partial)
   - `evaluation` -> re-run evaluation on existing implementation
3. Delete `handoff.md` after successful sprint completion

### Post-flight

1. Update state.json:
   ```bash
   node plugins/harness/scripts/harness-companion.mjs state-mutate --set-phase idle
   ```
   Then manually set `status` to `"paused"` and `stop_reason` to `"context reset via /reset"` in state.json.
2. Verify `.harness/handoff.md` was created and contains: current feature, last step, interrupted phase, modified files, next step
