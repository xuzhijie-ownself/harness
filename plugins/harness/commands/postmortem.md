---
name: postmortem
description: Generate a postmortem report for the current harness run.
  Reads evaluation artifacts, metrics, events, and feature history to produce
  .harness/postmortem.md with Timeline, Score Trends, Failure Analysis,
  Process Compliance, and Recommendations sections.
allowed_tools: ["Bash", "Read", "Write", "Glob"]
---

# /postmortem

Generate a structured postmortem report for the current harness run.

Run the **Command Pre-Flight Validation** from SKILL.md before proceeding.

## Preconditions

Verify before proceeding:
- `.harness/state.json` exists -- if not, run `/harness:start` first.
- `.harness/features.json` exists.
- At least one evaluation artifact exists in `.harness/sprints/` (any `NN-evaluation.json`).

If no evaluation artifacts exist, REFUSE. Print: "Cannot generate postmortem: no evaluation artifacts found. Run at least one sprint first."

## Data Gathering

Read all of the following data sources before writing the postmortem. Use the script subcommands for structured data where available.

### 1. Evaluation Artifacts

Find all evaluation JSON files:
```bash
ls .harness/sprints/*-evaluation.json 2>/dev/null
```

Read each `NN-evaluation.json` file. Extract from each:
- `round` number
- `decision` (PASS or FAIL)
- `target_feature_ids`
- `primary_scores` (all criteria and their scores)
- `blockers` (list of blocking issues)
- `non_blocking_issues`
- `contract_checks` (which checks passed/failed)
- `authenticity_gate.gate_result`

### 2. Metrics Summary

Run the metrics-summary subcommand for aggregated data:
```bash
node plugins/harness/scripts/harness-companion.mjs metrics-summary
```

This returns: `total_rounds`, `total_duration_ms`, `total_file_changes`, `score_trends`, and `round_details`.

### 3. State and Cost Tracking

Read `.harness/state.json`. Extract:
- `current_round`
- `last_completed_round`
- `cost_tracking.rounds` (timestamps per round and phase)
- `current_failure_streak`
- `domain_profile`
- `errors` (any agent spawn failures)

### 4. Features

Read `.harness/features.json`. Extract:
- Full feature list with `id`, `title`, `passes`, `status`, `maturity`, `depends_on`
- Count of required features passing vs total required
- Any features that were retried (targeted in multiple rounds)

### 5. Events Log

Run the read-events subcommand:
```bash
node plugins/harness/scripts/harness-companion.mjs read-events
```

If events exist, extract:
- Agent spawn timeline
- Phase transition sequence
- Feature selection history
- Evaluation completion events

### 6. Evaluation Markdown Reports (optional)

Read any `.harness/sprints/NN-evaluation.md` files for qualitative detail on blockers and findings.

## Output Structure

Write `.harness/postmortem.md` with the following structure. Synthesize the gathered data into each section -- do not simply dump raw JSON.

```markdown
# Postmortem Report

## Metadata
- Generated: <current ISO date>
- Rounds completed: <N>
- Domain profile: <profile from state.json>

## Timeline

Chronological table of all rounds with dates, targeted features, and outcomes.

| Round | Date | Feature(s) | Decision | Duration |
|-------|------|------------|----------|----------|
| 1 | <date> | F-XXX: <title> | PASS/FAIL | <duration> |

Include notes on any rounds that required retries or had agent errors.

## Score Trends

Table showing how each primary criterion score changed across rounds.

| Round | <criterion_1> | <criterion_2> | <criterion_3> | <criterion_4> |
|-------|---------------|---------------|---------------|---------------|
| 1 | <score> | <score> | <score> | <score> |

Note any significant score drops or improvements with brief explanation from evaluation artifacts.

## Failure Analysis

For each feature that failed at least once:
- Feature ID and title
- Number of attempts before passing (or still failing)
- Root cause from evaluation blockers
- What changed between the failing and passing attempt

If all rounds passed on first attempt, state that explicitly.

## Process Compliance

Assess whether the harness process was followed correctly:
- Was spec.md created and followed?
- Were all required artifacts created for each round? (contract, contract-review, builder-report, evaluation.md, evaluation.json)
- Were contract checks defined and evaluated?
- Was the authenticity gate applied? (check gate_result in evaluation JSONs)
- Were any agent spawn errors logged?

## Recommendations

Based on the data, provide 3-5 actionable recommendations for the next cycle:
- Patterns that worked well (keep doing)
- Patterns that caused friction (change)
- Specific process improvements based on failure analysis
- Score trend insights (which criteria need more attention)
```

## Post-flight

After writing `.harness/postmortem.md`:
1. Print the path to the generated file.
2. Print a one-line summary: "Postmortem covers [N] rounds, [M] features ([P] passing, [F] failing)."
