---
name: session
description: Run one supervised sprint round for a long-running harness project.
  Selects the next failing required feature, negotiates a sprint contract with
  evaluator review, implements it, and evaluates it. Waits for user confirmation
  between contract review and implementation.
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /session

Run one supervised sprint round (Variant A or B, supervised mode).

## Session Startup

1. Read `artifacts/progress.md`.
2. Run `git log --oneline -10` to recover context from recent commits.
3. Check for `artifacts/handoff.md` — if present, read it and resume from `next_step`.
4. Run `bash artifacts/init.sh` (or the command from `artifacts/init.md`) — STOP and report if baseline fails.
5. Read `artifacts/feature-list.json` — find highest-priority `passes: false` required feature.

## Contract Phase

6. Spawn the `generator` agent: "Propose a sprint contract for [feature-id]."
   → `artifacts/sprints/NN-contract.md`
7. Spawn the `evaluator` agent: "Review the contract at artifacts/sprints/NN-contract.md."
   → `artifacts/sprints/NN-contract-review.md`
8. Show the contract review to the user.
   - Rejected → return to step 6 with evaluator feedback.
   - Accepted → ask user to confirm before proceeding to implementation.

## Implementation Phase

9. Spawn the `generator` agent: "Implement the accepted contract at artifacts/sprints/NN-contract.md."
   → code changes + `artifacts/sprints/NN-builder-report.md`

## Evaluation Phase

10. Spawn the `evaluator` agent:
    "Grade the implementation. Contract: NN-contract.md. Builder report: NN-builder-report.md."
    → `artifacts/sprints/NN-evaluation.md`
    → `artifacts/sprints/NN-evaluation.json`
    → `artifacts/sprints/NN-evaluator-steps.md`
11. Update `artifacts/feature-list.json` based on evaluator `feature_evidence`.
12. Update `artifacts/progress.md`.
13. Show result to user:
    - **PASS** → score breakdown + recommended next action.
    - **FAIL** → specific blockers from evaluation + suggest re-running /session.

## Session End — Clean State

Code must be in a mergeable state before the session ends:
- No half-built features left uncommitted
- All tests pass (or known failures are documented)
- Git committed with a descriptive message
- `artifacts/progress.md` updated with what changed and what to do next

## After Successful Resumption from Handoff

If `artifacts/handoff.md` was read in step 3 and this session completes successfully,
delete `artifacts/handoff.md` to signal clean resumption.
