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

## Do Not

- silently collapse sprinted mode into simplified mode
- keep advancing just because budget remains
- let multi-feature grouping happen without a written waiver
