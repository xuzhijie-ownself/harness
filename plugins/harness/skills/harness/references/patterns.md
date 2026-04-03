# Shared Patterns

This file is the shared core for the harness.
Keep it small enough that every role can reference it without carrying the entire harness in memory.

For role-specific guidance, prefer:

- [../roles/initializer.md](../roles/initializer.md)
- [../roles/planner.md](../roles/planner.md)
- [../roles/generator.md](../roles/generator.md)
- [../roles/evaluator.md](../roles/evaluator.md)
- [../roles/coordinator.md](../roles/coordinator.md)
- [../roles/releaser.md](../roles/releaser.md)

## Shared Principles

- Separate generation from evaluation because models are too lenient when grading their own work.
- Use a machine-readable feature list to track what still fails and what is done.
- Use bounded implementation rounds so work stays testable.
- Stop when the required feature set passes; do not let sprint count become the main progress metric.

## Shared Artifact Layout

```text
project-root/
  release.json                   # PERSISTENT — survives .harness/ cleanup
  CHANGELOG.md                   # PERSISTENT — open-source convention
  .harness/                      # TRANSIENT — per-run state
    features.json
    progress.md
    state.json
    init.md
    spec.md
    decomposition.md             # optional when sprint rationale needs its own artifact
    summary.md
    handoff.md                   # reset-based compatibility runs only
    evaluator-calibration.md     # optional
    sprints/
      01-contract.md
      01-contract-review.md
      01-builder-report.md
      01-evaluation.md
      01-evaluation.json
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

### `features.json`

```json
{
  "version": 1,
  "updated_by": "initializer-1",
  "features": [
    {
      "id": "F-001",
      "title": "Create and edit tasks",
      "category": "functional",
      "description": "Users can create new tasks and edit existing ones inline",
      "required": true,
      "priority": "high",
      "status": "not_started",
      "passes": false,
      "depends_on": [],
      "maturity": "draft",
      "source_requirement": "",
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

Feature field reference:

- `depends_on`: Array of feature IDs that must have `passes: true` before this feature is targeted. Empty or absent means no dependencies. The coordinator skips dependency-blocked features during target selection.
- `maturity`: Feature maturity level. One of `"draft"` (initial implementation, known gaps), `"functional"` (core behavior works), `"reviewed"` (passed evaluation with 3+ on all criteria), `"polished"` (production-ready, 4+ on all criteria), `"accepted"` (stakeholder sign-off, set manually). Default: `"draft"`. The `passes` field remains binary — `functional` or above means passes. `maturity` adds granularity for tracking overall project readiness.
- `source_requirement`: Optional string linking the feature to an original business requirement, user story, or specification reference. Used primarily in architecture, tender, and business_analysis domain profiles for requirements traceability.

### `state.json`

```json
{
  "mode": "continuous",
  "status": "active",
  "variant": "variant-a-sprinted",
  "current_round": 2,
  "last_completed_round": 1,
  "active_feature_ids": ["F-002"],
  "expected_sprint_count": 5,
  "current_failure_streak": 0,
  "last_feature_pass_delta": 1,
  "stop_reason": "",
  "context_reset_threshold": 3,
  "rounds_since_reset": 1,
  "current_sprint_phase": "idle",
  "domain_profile": "software",
  "secondary_profile": "",
  "methodology": "agile",
  "errors": [],
  "cost_tracking": {
    "rounds": [
      {
        "round": 1,
        "started_at": "2026-04-01T10:00:00Z",
        "completed_at": "2026-04-01T10:15:00Z",
        "phases": {
          "contract": { "started_at": "", "completed_at": "" },
          "implementation": { "started_at": "", "completed_at": "" },
          "evaluation": { "started_at": "", "completed_at": "" }
        }
      }
    ]
  }
}
```

Field reference:

- `context_reset_threshold`: Number of rounds before coordinator pauses for context refresh. Default: 3.
- `rounds_since_reset`: Counter incremented each round; triggers context refresh handoff at `context_reset_threshold`.
- `current_sprint_phase`: One of `idle`, `contract`, `implementation`, `evaluation`. Used for sprint resume.
- `domain_profile`: Primary domain profile. One of `software` (default), `architecture`, `tender`, `research`, `content`, `business_analysis`, `custom`. Determines the 4 primary evaluation criteria.
- `secondary_profile`: Optional secondary domain profile for cross-domain projects. Empty string if not used.
- `methodology`: One of `agile` (default), `waterfall`, `scrum`, `kanban`. Set during `/init`.
- `errors`: Array of `{ "round", "agent", "error", "timestamp" }` objects logged on agent spawn failures.
- `cost_tracking`: Per-round timestamps for duration tracking across phases.

### `config.json`

```json
{
  "use_codex": "auto",
  "context_reset_threshold": 3,
  "auto_commit": true,
  "auto_retro": true,
  "retro_interval": 3,
  "max_retry_on_failure": 3,
  "evaluator_strictness": "standard",
  "commit_prefix_pass": "feat",
  "commit_prefix_fail": "wip",
  "commit_tag": "[harness]"
}
```

Field reference:

- `use_codex`: Controls Codex review usage. One of `"auto"` (detect and use if available), `"on"` (always attempt, warn if unavailable), `"off"` (never use). Default: `"auto"`.
- `context_reset_threshold`: Number of rounds before coordinator pauses for context refresh. Overrides `state.json` value if present. Default: `3`.
- `auto_commit`: Whether the coordinator auto-commits after each sprint phase. Default: `true`.
- `auto_retro`: Whether the coordinator generates sprint retrospectives automatically. Default: `true`.
- `retro_interval`: Number of rounds between automatic retrospectives. Default: `3`.
- `max_retry_on_failure`: Maximum retry attempts when an agent spawn or evaluation fails. Default: `3`.
- `evaluator_strictness`: Evaluator grading strictness level. One of `"lenient"`, `"standard"`, `"strict"`. Default: `"standard"`.
- `commit_prefix_pass`: Git commit prefix for passing evaluations. Default: `"feat"`.
- `commit_prefix_fail`: Git commit prefix for failing evaluations. Default: `"wip"`.
- `commit_tag`: Tag appended to all harness-generated commit messages. Default: `"[harness]"`.

State.json holds runtime state (round, phase, errors). Config.json holds persistent preferences. The initializer creates a default config.json during `/init`. Users can edit it manually between sessions. Config.json values take precedence over state.json defaults when both define the same field.

### `NN-evaluation.json`

```json
{
  "round": 2,
  "decision": "PASS",
  "target_feature_ids": ["F-002"],
  "primary_scores": {
    "product_depth": {
      "score": 4,
      "justification": "Matches anchor 4: interactive depth beyond display-only.",
      "prior_round_score": 3,
      "drift_check": "Higher because F-002 added real data persistence; F-001 was scaffold-only."
    },
    "functionality": {
      "score": 4,
      "justification": "Full CRUD with validation. Matches anchor 4.",
      "prior_round_score": 4,
      "drift_check": "Same as prior round."
    },
    "visual_design": {
      "score": 4,
      "justification": "Consistent component styling. Matches anchor 4.",
      "prior_round_score": 3,
      "drift_check": "Higher because responsive layout added this round."
    },
    "code_quality": {
      "score": 3,
      "justification": "Clean structure, acceptable error handling. Matches anchor 3.",
      "prior_round_score": 3,
      "drift_check": "Same as prior round."
    }
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
      "feature_id": "F-002",
      "passes": true,
      "reason": "Required checks passed and no blocking issues remain."
    }
  ],
  "test_results": {
    "tests_written": [],
    "passed": 0,
    "failed": 0,
    "skipped": 0,
    "coverage": ""
  },
  "review_findings": {
    "review_mode": "claude",
    "codex_detection": {
        "config_use_codex": "auto",
        "codex_available": false,
        "detection_method": "extraKnownMarketplaces or enabledPlugins in .claude/settings.json",
        "detection_result": "openai-codex not found in settings",
        "fallback_reason": null
    },
    "blocking": [],
    "non_blocking": []
  }
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
- Inputs: user prompt, features.json
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
- Inputs: spec.md, features.json
- Status: accepted

## Planned order
- F-001
- F-002

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
- Inputs: .harness/spec.md, .harness/features.json, prior evaluation artifacts
- Status: in_review

## Target feature IDs
- F-001

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
Criteria names come from the domain profile declared in spec.md. For the default `software` profile:
- Product depth
- Functionality
- Visual design
- Code quality

## Contract checks
Check IDs map to the domain profile's criteria:
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
- Inputs: accepted contract, spec, features.json
- Status: completed

## Target feature IDs
- F-001

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
- Inputs: accepted contract, builder report, running app, features.json
- Status: pass
- Reviewed by: evaluator-1
- Decision: pass

## Target feature IDs
- F-001

## Result
- PASS or FAIL

## Numeric scores
Criteria names come from the domain profile declared in spec.md. For the default `software` profile:
- Product depth: 0-5
- Functionality: 0-5
- Visual design: 0-5
- Code quality: 0-5

## Score Justification
For each criterion, reference the anchor from evaluator-calibration.md and compare against prior round.

## Test Results
- Tests written: [list of test files]
- Suite results: passed/failed/skipped/coverage
- Findings from testing

## Code Review
- Review mode: codex | claude
- Config use_codex: [value from config.json]
- Codex available: [true|false — openai-codex found in extraKnownMarketplaces or enabledPlugins]
- Detection result: [what was found]
- Fallback reason: [if codex was expected but claude used, why]
- Blocking findings: [list]
- Non-blocking findings: [list]

## Contract check results
- `PD-01`: pass | fail
- `FN-01`: pass | fail
- `VD-01`: pass | fail
- `CQ-01`: pass | fail

## Replayable Steps
1. Open the app
2. Seed or create the required state
3. Run the browser steps needed for each contract check
4. Include exact storage seeds, URLs, filters, and assertions

## Feature evidence
- F-001: why it now passes or still fails
```

### `handoff.md`

```md
# Session Handoff

## Metadata
- Role: generator | coordinator
- Agent: <agent-id>
- Inputs: .harness/progress.md, git diff
- Status: paused

## Current feature
- ID: F-XXX
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

### `init.bat`

```bat
@echo off
REM Start the dev server and run a smoke test.
REM Generated by the initializer agent — edit to match your project.

REM TODO: replace with actual start command for your project
start /B npm run dev
timeout /t 3 /nobreak >nul

REM Smoke test — verify the server responds
curl -sf http://localhost:3000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo OK — dev server running
) else (
  echo FAIL — dev server did not respond on http://localhost:3000
  exit /b 1
)
```

### `cost-log.md`

```md
# Cost Log

## Metadata
- Role: coordinator
- Agent: coordinator-1
- Inputs: state.json
- Status: active

| Round | Phase | Duration | Cost | Notes |
|-------|-------|----------|------|-------|
| 1 | planner | — | — | |
| 1 | generator | — | — | |
| 1 | evaluator | — | — | |
```

### `release.json` (project root)

```json
{
  "current_version": "0.1.0",
  "releases": [
    {
      "version": "0.1.0",
      "date": "2026-04-01",
      "features_shipped": ["F-001", "F-002"],
      "features_deferred": [],
      "changelog": "Initial release with core features F-001 and F-002.",
      "sprint_count": 14,
      "previous_version": null
    }
  ],
  "next_version": "0.2.0"
}
```

### `CHANGELOG.md` (project root)

```md
# Changelog

## [0.1.0] - 2026-04-01

### Features Shipped
- **F-001**: Create and edit tasks
- **F-002**: Task filtering and search

### Deferred
- None

### Stats
- Sprint count: 14
- Required features: 2/2 passing

---
*Generated by the releaser agent.*
```

### `evaluator-calibration.md`

```md
# Evaluator Calibration

## Metadata
- Role: evaluator
- Agent: evaluator-1
- Inputs: spec.md (domain profile), round 1 evaluation
- Status: active

## Criterion: <criterion_name>

### Score 2 (below acceptable)
- [concrete description of what a 2 looks like for this project]

### Score 3 (acceptable baseline)
- [concrete description of what a 3 looks like for this project]

### Score 4 (strong)
- [concrete description of what a 4 looks like for this project]

### Score 5 (excellent for scope)
- [concrete description of what a 5 looks like for this project]
```

Repeat the criterion section for each of the domain profile's 4 primary criteria. Anchors are project-specific — the framework provides the structure, the project provides the examples.

### `retro-RX-RY.md`

```md
# Sprint Retrospective — Rounds X-Y

## Metadata
- Role: coordinator
- Status: completed

## What Worked
- [effective patterns observed]

## What Didn't Work
- [failures and their root causes]

## Adjustments for Next Rounds
- [concrete changes to apply]

## Patterns Detected
- [recurring issues or strengths]
```

### Domain Profile section in `spec.md`

Add this section to spec.md after the Overview or Execution Strategy:

```md
## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Code, tests, configs, UI
- Stakeholder lens: End users, developers
```

Note: criteria names in NN-contract.md and NN-evaluation.md/json come from the domain profile declared here. If no profile is specified, default to `software`.

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
8. Did each accepted round include `NN-evaluation.md` and `NN-evaluation.json`?
9. In continuous mode, did the coordinator either advance, pause, or stop explicitly?

If the answer to the first six questions is no, or the failing-feature count does not move, the harness is drifting.
