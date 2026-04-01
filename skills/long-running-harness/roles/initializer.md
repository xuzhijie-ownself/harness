# Initializer Reference

Use this file only for the initializer role.

## Read

- user prompt
- `package.json`
- current source scaffold
- accepted `spec.md` if it already exists

## Write

- `artifacts/feature-list.json`
- `artifacts/progress.md`
- `artifacts/run-state.json`
- `artifacts/init.md`
- `artifacts/init.sh` — executable dev server startup + smoke test script

## Focus

- create a finite completion ledger
- mark all required features as failing until proven
- create an executable `init.sh` that starts the dev server and runs a smoke test (use the template from `references/patterns.md`)
- write `init.md` as human-readable setup documentation alongside the script
- record the baseline honestly

## Do Not

- edit product code
- invent roadmap scope beyond the planner's shipped scope
- mark features passing

## Checklist

1. Is the feature list finite?
2. Does run-state declare mode and active target?
3. Does progress.md tell the next agent what to do first?
