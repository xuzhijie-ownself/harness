---
name: postmortem
description: "Generate a postmortem report for the current harness run. Reads evaluation artifacts, metrics, and feature history to produce .harness/postmortem.md with Timeline, Score Trends, Failure Analysis, Process Compliance, and Recommendations sections."
allowed_tools: ["Bash", "Read", "Write", "Glob"]
---

# /postmortem

Generate a structured postmortem report for the current harness run.

Run the **Command Pre-Flight Validation** from SKILL.md before proceeding.

## Preconditions

Verify before proceeding:
- `.harness/state.json` exists -- if not, run `/harness:start` first.
- `.harness/features.json` exists.
- At least one evaluation artifact exists in `.harness/sprints/` (any `NN-eval.json`).

If no evaluation artifacts exist, REFUSE. Print: "Cannot generate postmortem: no evaluation artifacts found. Run at least one sprint first."

## Data Gathering

**Quick path**: Run the `postmortem-data` subcommand to get all data in one JSON object:
```bash
node plugins/harness/scripts/harness-companion.mjs postmortem-data
```
This returns `{ state, features, metrics, git_timeline, evaluations, rounds_completed }` -- all data sources needed for the postmortem sections below.

**Manual path** (if you need more detail): Read each data source individually:

### 1. Evaluation Artifacts

Find all evaluation JSON files:
```bash
ls .harness/sprints/*-eval.json 2>/dev/null
```

Read each `NN-eval.json` file. Extract from each:
- `round` number
- `decision` (PASS or FAIL)
- `target_feature_ids`
- `primary_scores` (all criteria and their scores)
- `blockers` (list of blocking issues)
- `non_blocking_issues`
- `contract_checks` (which checks passed/failed)
- `authenticity_gate.gate_result`

### 2. State and Cost Tracking

Read `.harness/state.json`. Extract:
- `current_round`
- `last_completed_round`
- `cost_tracking.rounds` (timestamps per round and phase)
- `current_failure_streak`
- `domain_profile`
- `errors` (any agent spawn failures)

### 3. Features

Read `.harness/features.json`. Extract:
- Full feature list with `id`, `title`, `passes`, `status`, `maturity`, `depends_on`
- Count of required features passing vs total required
- Any features that were retried (targeted in multiple rounds)

### 4. Git Timeline

Run `git log --oneline` to reconstruct the timeline of commits and phases.

### 5. Evaluation Markdown Reports (optional)

Read any `.harness/sprints/NN-eval.md` files for qualitative detail on blockers and findings.

## Output Structure

Write `.harness/postmortem.md` with the following structure. Synthesize the gathered data into each section -- do not simply dump raw JSON.

**ENFORCEMENT**: Every section MUST have a table or explicit statement, even when the result is "none found" or "all passed on first attempt." Do not reduce a section to a one-liner -- always include the full table structure with data rows.

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

Note any significant score drops or improvements with brief explanation from evaluation artifacts. If `finalize-round` reported any `drift_warning` in cost_tracking, highlight it here.

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
- Were all required artifacts created for each round? (proposal, review, report, eval.md, eval.json)
- Were contract checks defined and evaluated?
- Was the authenticity gate applied? (check gate_result in evaluation JSONs)
- Were any agent spawn errors logged?

## Integrity Audit

Run the stale reference grep check and report results:
```bash
grep -rn "review_mode\|codex_detection\|events\.jsonl\|events\.mjs\|metrics\.mjs\|summary\.md\|decomposition\.md\|init\.md\|NN-contract\b\|NN-evaluation\|builder-report\|contract-review\|not_started\|in_progress\b\|functional\b\|polished\b" plugins/ --include="*.md" --include="*.mjs"
```

Report:
- Number of stale references found (target: 0)
- If any found: list file, line, and what needs fixing
- Verify: all sprint artifacts use new naming (proposal/review/report/eval)
- Verify: features.json uses only pending/done status and draft/reviewed/accepted maturity
- Verify: plugin.json agents[] and commands[] arrays match actual files on disk

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
