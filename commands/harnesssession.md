---
name: harness:session
description: Run one supervised sprint round for a harness project.
  Selects the next failing required feature, negotiates a sprint contract with
  evaluator review, implements it, and evaluates it. Waits for user confirmation
  between contract review and implementation.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /harness:session

Run one supervised sprint round (Variant A or B, supervised mode).

## Migration Check
Before proceeding, check if old-format `artifacts/` directory exists:
- If `artifacts/` exists but `.harness/` does not: print "Old format detected. Run /harness:migrate first." and STOP.
- If both exist: print warning but continue (user may be mid-migration).

## Sprint Resume

Before starting fresh, check `.harness/state.json` `current_sprint_phase`:

| Phase | Resume action |
|-------|---------------|
| `idle` | Start a new sprint from step 1 |
| `contract` | Resume at Contract Phase (step 6) — contract was being negotiated |
| `implementation` | Resume at Implementation Phase (step 9) — contract was accepted, implementation in progress |
| `testing` | Resume at Evaluation Phase (step 10) — implementation complete, testing in progress |
| `review` | Resume at Evaluation Phase (step 10) — review in progress |
| `evaluation` | Resume at step 11 — evaluation done, update features and progress |

Update `current_sprint_phase` in `state.json` at the start of each phase transition.
If `current_sprint_phase` is not `idle`, skip ahead to the corresponding phase instead of restarting the sprint.

## Session Startup

1. Read `.harness/progress.md`.
2. Run `git log --oneline -10` to recover context from recent commits.
3. Check for `.harness/handoff.md` — if present, read it and resume from `next_step`.
4. Run `bash .harness/init.sh` (or the command from `.harness/init.md`) — STOP and report if baseline fails.
5. Read `.harness/features.json` — find highest-priority `passes: false` required feature.

## Contract Phase

Set `current_sprint_phase` to `contract` in `state.json`.

6. Spawn the `generator` agent: "Propose a sprint contract for [feature-id]."
   → `.harness/sprints/NN-contract.md`
7. Spawn the `evaluator` agent: "Review the contract at .harness/sprints/NN-contract.md."
   → `.harness/sprints/NN-contract-review.md`
8. Show the contract review to the user.
   - Rejected → return to step 6 with evaluator feedback.
   - Accepted → ask user to confirm before proceeding to implementation.

## Implementation Phase

Set `current_sprint_phase` to `implementation` in `state.json`.

9. Spawn the `generator` agent: "Implement the accepted contract at .harness/sprints/NN-contract.md."
   → code changes + `.harness/sprints/NN-builder-report.md`

## Evaluation Phase

Set `current_sprint_phase` to `evaluation` in `state.json`.

10. Spawn the `evaluator` agent:
    "Grade the implementation. Contract: NN-contract.md. Builder report: NN-builder-report.md."
    → `.harness/sprints/NN-evaluation.md`
    → `.harness/sprints/NN-evaluation.json`
    → `.harness/sprints/NN-evaluator-steps.md`
11. Update `.harness/features.json` based on evaluator `feature_evidence`.
12. Update `.harness/progress.md`.
13. Show result to user:
    - **PASS** → score breakdown + recommended next action.
    - **FAIL** → specific blockers from evaluation + suggest re-running /harness:session.

Set `current_sprint_phase` to `idle` in `state.json` after completing the round.

## Auto-Commit

After evaluation completes:
- PASS: `git add -A && git commit -m "feat(F-XXX): <feature title> — sprint N [harness]"`
- FAIL: `git add -A && git commit -m "wip(F-XXX): <feature title> — sprint N attempt [harness]"`

## Session End — Clean State

Code must be in a mergeable state before the session ends:
- No half-built features left uncommitted
- All tests pass (or known failures are documented)
- Git committed with a descriptive message
- `.harness/progress.md` updated with what changed and what to do next

## After Successful Resumption from Handoff

If `.harness/handoff.md` was read in step 3 and this session completes successfully,
delete `.harness/handoff.md` to signal clean resumption.
