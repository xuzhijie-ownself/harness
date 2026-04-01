# Shared Patterns

This file is the shared core for the long-running harness.
Keep it small enough that every role can reference it without carrying the entire harness in memory.

For role-specific guidance, prefer:

- [../roles/initializer.md](../roles/initializer.md)
- [../roles/planner.md](../roles/planner.md)
- [../roles/generator.md](../roles/generator.md)
- [../roles/evaluator.md](../roles/evaluator.md)
- [../roles/coordinator.md](../roles/coordinator.md)

## Shared Principles

- Separate generation from evaluation because models are too lenient when grading their own work.
- Use a machine-readable feature list to track what still fails and what is done.
- Use bounded implementation rounds so work stays testable.
- Stop when the required feature set passes; do not let sprint count become the main progress metric.

## Shared Artifact Layout

```text
artifacts/
  feature-list.json
  progress.md
  run-state.json
  init.md
  spec.md
  decomposition.md              # optional when sprint rationale needs its own artifact
  summary.md
  handoff.md                    # reset-based compatibility runs only
  evaluator-calibration.md      # optional
  sprints/
    01-contract.md
    01-contract-review.md
    01-builder-report.md
    01-evaluation.md
    01-evaluation.json
    01-evaluator-steps.md
```

## Shared Metadata

Use this metadata block at the top of every role-owned Markdown artifact:

```md
## Metadata
- Role: initializer | planner | generator | evaluator | coordinator
- Agent: agent identifier or session name
- Inputs: files reviewed before writing this artifact
- Status: draft | in_review | accepted | rejected | pass | fail | active | complete | paused
```

For review artifacts, also include:

```md
- Reviewed by: agent identifier or session name
- Decision: accept | reject | changes_requested | pass | fail
```

## Shared JSON Schemas

### `feature-list.json`

```json
{
  "version": 1,
  "updated_by": "initializer-1",
  "features": [
    {
      "id": "feature-001",
      "title": "Create and edit tasks",
      "category": "functional",
      "description": "Users can create new tasks and edit existing ones inline",
      "required": true,
      "priority": "high",
      "status": "not_started",
      "passes": false,
      "steps": [
        "Navigate to task list",
        "Click 'New Task' button",
        "Enter task title and save",
        "Click existing task to edit",
        "Verify edits persist after reload"
      ],
      "evidence": [],
      "notes": ""
    }
  ]
}
```

### `run-state.json`

```json
{
  "mode": "continuous",
  "status": "active",
  "variant": "variant-a-sprinted",
  "current_round": 2,
  "last_completed_round": 1,
  "active_feature_ids": ["feature-002"],
  "expected_sprint_count": 5,
  "current_failure_streak": 0,
  "last_feature_pass_delta": 1,
  "stop_reason": ""
}
```

### `NN-evaluation.json`

```json
{
  "round": 2,
  "decision": "PASS",
  "target_feature_ids": ["feature-002"],
  "primary_scores": {
    "product_depth": 4,
    "functionality": 4,
    "visual_design": 4,
    "code_quality": 3
  },
  "contract_checks": [
    {
      "id": "FN-01",
      "required": true,
      "result": "pass",
      "evidence": "Playwright flow: create-edit-reload"
    }
  ],
  "blockers": [],
  "non_blocking_issues": [],
  "feature_evidence": [
    {
      "feature_id": "feature-002",
      "passes": true,
      "reason": "Required checks passed and no blocking issues remain."
    }
  ]
}
```

## Shared Templates

### `progress.md`

```md
# Progress Log

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: user prompt
- Status: active

## Current target
- Feature IDs currently being worked on

## Baseline
- What already works
- What is currently failing

## This round
- What changed this round
- What failed this round

## Latest evidence
- Build/test/browser results

## Next step
- The first thing the next agent should verify or do
```

### `spec.md`

```md
# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, feature-list.json
- Status: accepted

## Overview
- What the app is and who it serves

## Design direction
- Visual identity and UX tone

## Shipped scope
- Finite required features only

## User stories
- As a user, I want to ...

## Execution strategy
- Variant: Variant A | Variant B | Variant C
- Mode: continuous | supervised-step
- Expected sprint count or one-sprint rationale
- Default target ordering
- Multi-feature sprint policy
- Simplification policy

## High-level technical design
- Frontend
- Backend
- Data/storage

## Non-goals
- Explicitly deferred work
```

### `decomposition.md`

```md
# Decomposition Decision

## Metadata
- Role: coordinator
- Agent: coordinator-1
- Inputs: spec.md, feature-list.json
- Status: accepted

## Planned order
- feature-001
- feature-002

## Grouping policy
- One failing feature per sprint by default

## Exceptions
- If multiple features are grouped, explain why
```

### `NN-contract.md`

```md
# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: artifacts/spec.md, artifacts/feature-list.json, prior evaluation artifacts
- Status: in_review

## Target feature IDs
- feature-001

## Grouping waiver
- Omit when there is only one failing feature target
- If multiple features are targeted, explain why grouping reduces risk instead of hiding it

## Goal
- What this bounded round adds

## Deliverables
- Concrete files, routes, screens, endpoints, or behaviors

## Verification
- Exact tests, browser flows, API checks, and state checks

## Acceptance criteria
- Product depth
- Functionality
- Visual design
- Code quality

## Contract checks
- `PD-01`: required or advisory check with verification method
- `FN-01`: required or advisory check with verification method
- `VD-01`: required or advisory check with verification method
- `CQ-01`: required or advisory check with verification method

## Risks
- Dependencies or likely failure modes
```

### `NN-builder-report.md`

```md
# Builder Report

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: accepted contract, spec, feature-list.json
- Status: completed

## Target feature IDs
- feature-001

## Implemented
- What changed

## Commands run
- Build, test, lint, migration, seed, or browser steps

## Self-check
- What appears complete
- What is still risky

## Suggested feature updates
- Which features may now pass, with evidence
```

### `NN-evaluation.md`

```md
# Evaluation Report

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: accepted contract, builder report, running app, feature-list.json
- Status: pass
- Reviewed by: evaluator-1
- Decision: pass

## Target feature IDs
- feature-001

## Result
- PASS or FAIL

## Numeric scores
- Product depth: 0-5
- Functionality: 0-5
- Visual design: 0-5
- Code quality: 0-5

## Findings
- Title
  - reproduction
  - expected
  - actual
  - likely cause

## Contract check results
- `PD-01`: pass | fail
- `FN-01`: pass | fail
- `VD-01`: pass | fail
- `CQ-01`: pass | fail

## Feature evidence
- feature-001: why it now passes or still fails
```

### `NN-evaluator-steps.md`

```md
# Evaluator Steps

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: accepted contract, running app
- Status: completed

## Replayable steps
1. Open the app
2. Seed or create the required task state
3. Run the browser steps needed for each contract check

## Notes
- Include exact storage seeds, URLs, filters, and assertions where relevant
```

### `handoff.md`

```md
# Session Handoff

## Metadata
- Role: generator | coordinator
- Agent: <agent-id>
- Inputs: artifacts/progress.md, git diff
- Status: paused

## Current feature
- ID: feature-XXX
- Title: <title>

## Last completed step
- <one sentence describing the last thing that was finished>

## Modified files
- <list from git diff --name-only>

## Open questions / blockers
- <if any, otherwise "None">

## Next step
- <single sentence: the first thing the next session should do>
```

### `init.sh`

```bash
#!/usr/bin/env bash
# Start the dev server and run a smoke test.
# Generated by the initializer agent — edit to match your project.
set -e

# TODO: replace with actual start command for your project
npm run dev &
DEV_PID=$!
sleep 3

# Smoke test — verify the server responds
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
  echo "OK — dev server running (PID $DEV_PID)"
else
  echo "FAIL — dev server did not respond on http://localhost:3000"
  kill $DEV_PID 2>/dev/null
  exit 1
fi
```

### `cost-log.md`

```md
# Cost Log

## Metadata
- Role: coordinator
- Agent: coordinator-1
- Inputs: run-state.json
- Status: active

| Round | Phase | Duration | Cost | Notes |
|-------|-------|----------|------|-------|
| 1 | planner | — | — | |
| 1 | generator | — | — | |
| 1 | evaluator | — | — | |
```

## Quantified Rubric

Use a `0-5` scale for each primary criterion.

- `0`: absent or broken
- `1`: severely incomplete
- `2`: present but below acceptable quality
- `3`: acceptable for the sprint goal
- `4`: strong with minor issues
- `5`: excellent for the scoped work

Acceptance rules:

- Any primary criterion below `3` fails the round.
- Any required contract check marked failed fails the round.
- Any blocking bug in a core flow fails the round.
- Averages may be reported, but they do not override failed criteria.

## Review Checklist

Use this when reviewing whether a run truly followed the harness:

1. Was an initializer used?
2. Does a machine-readable feature list exist?
3. Were separate planner/generator/evaluator agents explicitly dispatched?
4. Was there a contract review artifact before implementation started?
5. Did the spec explain the execution strategy and sprinting rationale?
6. Did each sprint target one failing required feature unless a grouping waiver existed?
7. Did the number of failing required features go down?
8. Did each accepted round include `NN-evaluation.md`, `NN-evaluation.json`, and `NN-evaluator-steps.md`?
9. In continuous mode, did the coordinator either advance, pause, or stop explicitly?

If the answer to the first six questions is no, or the failing-feature count does not move, the harness is drifting.
