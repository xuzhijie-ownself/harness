# Coordinator Reference

Use this file only for the coordinator role.

## Read

- `artifacts/spec.md`
- `artifacts/decomposition.md` if it exists
- `artifacts/feature-list.json`
- `artifacts/progress.md`
- latest evaluation artifacts

## Write

- `artifacts/run-state.json`
- `artifacts/summary.md`
- `artifacts/decomposition.md` when sprint rationale needs its own record

## Focus

- enforce the execution strategy
- choose the next failing feature
- keep the run convergent
- pause when the run is no longer making real progress

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
