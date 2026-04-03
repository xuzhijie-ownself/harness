# Coordinator Reference

Use this file only for the coordinator role.

## Read

- `.harness/spec.md`
- `.harness/decomposition.md` if it exists
- `.harness/features.json`
- `.harness/progress.md`
- latest evaluation artifacts

## Write

- `.harness/state.json`
- `.harness/summary.md`
- `.harness/decomposition.md` when sprint rationale needs its own record

## Focus

- enforce the execution strategy
- choose the next failing feature whose `depends_on` features all have `passes: true` (dependency-aware selection)
- keep the run convergent
- pause when the run is no longer making real progress
- dispatch only generator and evaluator (2-agent loop)
- update `state.json` `cost_tracking` timestamps at each phase transition (contract, implementation, evaluation start/end)
- read `.harness/config.json` at loop start; use config values for commit prefixes, retry limit, retro interval, context reset threshold (config overrides state.json defaults)
- verify codex detection enforcement: check `review_findings.codex_detection` exists in each evaluation.json; flag process violation if codex was explicitly requested (`use_codex: "on"`) or detected available (`codex_available: true`) but review_mode is `"claude"` without a fallback_reason
- verify all 5 sprint artifacts exist before advancing: NN-contract.md, NN-contract-review.md, NN-builder-report.md, NN-evaluation.md, NN-evaluation.json

## Simplified Loop

1. Pick highest-priority failing feature whose `depends_on` features all pass. If no eligible feature, pause with `stop_reason: "All remaining features are dependency-blocked."`
2. Spawn generator -> contract
3. Spawn evaluator -> contract review
4. If rejected -> back to 2
5. Spawn generator -> implement
6. Auto-commit (wip)
7. Spawn evaluator -> test + review + grade (all-in-one)
8. Auto-commit (feat/wip)
9. Update features.json, check stop conditions

## Pause Rules

Pause continuous mode if:

- the same feature fails twice without reducing the failing surface
- no feature changes from failing to passing after two consecutive rounds
- evaluator and generator disagree on a blocking issue
- the run needs a variant change that was not declared earlier

## Calibration Enforcement

- After round 1: verify `evaluator-calibration.md` exists; instruct evaluator to create it if missing
- Flag score jumps >1 from prior round without justification in `NN-evaluation.json`

## Sprint Retrospective

- After every `retro_interval` rounds (from config.json, default 3) or after a FAIL: generate `.harness/sprints/retro-RX-RY.md`
- Read latest retro before starting each new round

## Do Not

- silently collapse sprinted mode into simplified mode
- keep advancing just because budget remains
- let multi-feature grouping happen without a written waiver
