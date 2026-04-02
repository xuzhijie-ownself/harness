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

1. Update `.harness/state.json` — increment current_round
2. Pick highest-priority `passes: false` required feature
3. Spawn `generator` agent (propose contract)
4. Spawn `evaluator` agent (review contract)
5. If rejected: request contract revision; re-spawn evaluator
6. Spawn `generator` agent (implement)
7. Auto-commit: `git add -A && git commit -m "wip(F-XXX): implement <title> — sprint N [harness]"`
8. Spawn `evaluator` agent (test + review + grade — all-in-one)
9. Auto-commit: `git add -A && git commit -m "feat/wip(F-XXX): <title> — sprint N [harness]"`
10. Update `.harness/features.json` from evaluator feature_evidence
11. Check stop conditions (all required features pass, or hard blocker)
12. If all required features pass: spawn `releaser` agent before writing summary

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

## Evaluator Enforcement

The coordinator MUST NOT update `.harness/features.json` directly.
Only evaluator-backed evidence in `NN-evaluation.json` `feature_evidence` may flip pass/fail.

Before advancing to the next round, verify ALL of these artifacts exist for round NN:
- `.harness/sprints/NN-contract.md`
- `.harness/sprints/NN-evaluation.md`
- `.harness/sprints/NN-evaluation.json`

If any are missing, set `stop_reason` to `"missing required sprint artifacts for round NN"` and STOP.

## Pause Rules

Write reason to `.harness/state.json` `stop_reason` field and halt if:
- Same feature fails twice without reducing failing surface
- No feature reaches `passes: true` after two consecutive rounds
- Generator and evaluator disagree on a blocking bug
- Run needs a variant change not declared in `.harness/spec.md`

Do NOT keep looping just because budget remains.
