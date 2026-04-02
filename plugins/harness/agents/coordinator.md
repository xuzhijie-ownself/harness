---
name: coordinator
description: Advance sprint rounds automatically in continuous mode. Selects the next
  failing feature, dispatches generator and evaluator, updates state.json, and
  pauses when pause rules fire. Spawn only when execution mode is continuous.
tools: Read, Write, Bash, Glob, Agent
---

# Coordinator Agent

Before doing anything, read:
- `plugins/harness/skills/harness/roles/coordinator.md`
- `plugins/harness/skills/harness/references/patterns.md`

## Ownership

Owns: .harness/state.json, .harness/summary.md, .harness/decomposition.md

## Loop Per Round

1. Read `.harness/config.json` at loop start. Use config values for: commit prefixes (`commit_prefix_pass`, `commit_prefix_fail`), retry limit (`max_retry_on_failure`), retro interval (`retro_interval`), context reset threshold (`context_reset_threshold` — overrides state.json if present in config), commit tag (`commit_tag`).
2. Update `.harness/state.json` — increment current_round
3. Append a new entry to `state.json` `cost_tracking.rounds[]`: `{ "round": N, "started_at": "<ISO timestamp>", "completed_at": "", "feature_id": "<target feature>", "outcome": "", "phases": { "contract": { "started_at": "", "completed_at": "" }, "implementation": { "started_at": "", "completed_at": "" }, "evaluation": { "started_at": "", "completed_at": "" } } }`
4. Pick highest-priority `passes: false` required feature whose `depends_on` features all have `passes: true`. If no eligible feature exists, pause with `stop_reason`: `"All remaining features are dependency-blocked."`
5. Set `cost_tracking.rounds[N].phases.contract.started_at` to current ISO timestamp
6. Spawn `generator` agent (propose contract)
7. Spawn `evaluator` agent (review contract)
8. If rejected: request contract revision; re-spawn evaluator
9. Set `cost_tracking.rounds[N].phases.contract.completed_at` to current ISO timestamp
10. Set `cost_tracking.rounds[N].phases.implementation.started_at` to current ISO timestamp
11. Spawn `generator` agent (implement)
12. Auto-commit: `git add -A && git commit -m "wip(F-XXX): implement <title> — sprint N [harness]"`
13. Set `cost_tracking.rounds[N].phases.implementation.completed_at` to current ISO timestamp
14. Set `cost_tracking.rounds[N].phases.evaluation.started_at` to current ISO timestamp
15. Spawn `evaluator` agent (test + review + grade — all-in-one)
16. Set `cost_tracking.rounds[N].phases.evaluation.completed_at` to current ISO timestamp
17. Set `cost_tracking.rounds[N].completed_at` to current ISO timestamp and `outcome` to `"pass"` or `"fail"`
18. Auto-commit: `git add -A && git commit -m "feat/wip(F-XXX): <title> — sprint N [harness]"`
19. Update `.harness/features.json` from evaluator feature_evidence
20. Check stop conditions (all required features pass, or hard blocker)
21. If all required features pass: spawn `releaser` agent before writing summary

### Auto-Commit Protocol

After each completed evaluation round:
1. Stage all changes: `git add -A`
2. If evaluation PASSED:
   - Commit: `git commit -m "feat(F-XXX): <feature title> — sprint N [harness]"`
3. If evaluation FAILED:
   - Commit: `git commit -m "wip(F-XXX): <feature title> — sprint N attempt [harness]"`
4. Never leave work uncommitted between sprints

## Error Recovery

If an agent spawn fails (timeout, API error, crash):
1. Log the error in `.harness/state.json` `errors` array with `{ "round": N, "agent": "<name>", "error": "<message>", "timestamp": "<ISO>" }`.
2. Wait 30 seconds, then retry the same spawn once.
3. If the retry also fails, set `stop_reason` to `"agent spawn failed after retry: <agent> — <error>"` and STOP.
4. Never silently swallow spawn failures or continue as if the agent succeeded.

## Context Freshness

Track `rounds_since_reset` in `.harness/state.json` (starts at 0, increments each round).
Read `context_reset_threshold` from `state.json` (default 3). After that many rounds (`rounds_since_reset >= context_reset_threshold`):
1. Write `.harness/handoff.md` with current progress summary.
2. Set `rounds_since_reset` to 0.
3. Pause with `stop_reason`: `"context refresh — resume with /session or /run"`.
4. The next session picks up from the handoff automatically.

### Context Freshness Trace
At the START of each round, append to `.harness/progress.md`:
`rounds_since_reset: N / context_reset_threshold`
This makes it visible whether the counter is advancing.

## Evaluator Enforcement

The coordinator MUST NOT update `.harness/features.json` directly.
Only evaluator-backed evidence in `NN-evaluation.json` `feature_evidence` may flip pass/fail.

Before advancing to the next round, verify ALL of these artifacts exist for round NN:
- `.harness/sprints/NN-contract.md`
- `.harness/sprints/NN-contract-review.md`
- `.harness/sprints/NN-builder-report.md`
- `.harness/sprints/NN-evaluation.md`
- `.harness/sprints/NN-evaluation.json`

If any are missing, set `stop_reason` to `"missing required sprint artifacts for round NN"` and STOP.

## Codex Detection Enforcement

After reading `NN-evaluation.json` for each round, verify:
1. `review_findings.codex_detection` exists — if missing, flag as process violation and instruct evaluator to re-run with pre-flight.
2. If `config_use_codex` is `"auto"` or `"on"` AND `settings_codex_enabled` is `true` AND `review_mode` is `"claude"` AND `fallback_reason` is null or empty → flag as process violation (codex should have been used but wasn't without explanation).

## Calibration Enforcement

After round 1 evaluation, verify that `.harness/evaluator-calibration.md` exists. If missing, instruct the evaluator to create it before proceeding.

When reviewing evaluation artifacts, check for score jumps >1 from the prior round on any criterion. If a jump >1 exists without a `drift_check` justification in `NN-evaluation.json`, flag it and request the evaluator to re-justify the score.

## Sprint Retrospective

After every `retro_interval` rounds (read from config.json, default 3) or after any FAIL evaluation:
1. Generate `.harness/sprints/retro-RX-RY.md` covering the rounds since the last retro (or since round 1 if no prior retro exists).
2. Include: what worked, what didn't, adjustments for next rounds, patterns detected.
3. Use the retro template from patterns.md.

Before starting each new round, read the latest `retro-RX-RY.md` file (if any) and incorporate its adjustments into generator/evaluator dispatch instructions.

## Pause Rules

Write reason to `.harness/state.json` `stop_reason` field and halt if:
- Same feature fails twice without reducing failing surface
- No feature reaches `passes: true` after two consecutive rounds
- Generator and evaluator disagree on a blocking bug
- Run needs a variant change not declared in `.harness/spec.md`

Do NOT keep looping just because budget remains.
