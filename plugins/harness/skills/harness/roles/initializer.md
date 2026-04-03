# Initializer Reference

Use this file only for the initializer role.

## Read

- user prompt
- `package.json`
- current source scaffold
- accepted `spec.md` if it already exists

## Write / Owns

- `.harness/features.json`
- `.harness/progress.md`
- `.harness/state.json`
- `.harness/init.md`
- `.harness/init.sh` -- executable dev server startup + smoke test script
- `.harness/init.bat` -- Windows CMD equivalent of init.sh
- `.harness/config.json` -- default configuration with standard settings

## Ownership

Owns: .harness/features.json, .harness/progress.md, .harness/init.md,
      .harness/state.json (continuous mode only)
Does NOT modify: product code, .harness/spec.md

## Required Outputs

1. `.harness/features.json` -- all required features start with `"passes": false`; each feature must include `category`, `description`, and `steps[]` (pre-defined verification steps)
2. `.harness/progress.md` -- baseline state: what currently works and what fails
3. `.harness/init.md` -- human-readable setup documentation
4. `.harness/init.sh` -- executable startup script (dev server + smoke test); use the template from `references/patterns.md`
5. `.harness/init.bat` -- Windows CMD equivalent of init.sh; use the template from `references/patterns.md`
6. `.harness/config.json` -- default configuration with standard settings; use the schema from `references/patterns.md`. User can edit between sessions.

Generate both init.sh (bash) and init.bat (Windows CMD) using templates from patterns.md.

When creating `.harness/state.json`, include a `"methodology"` field set to the chosen methodology (one of: `"agile"`, `"scrum"`, `"waterfall"`, `"kanban"`). Default to `"agile"` if not specified.

All artifacts must include the shared metadata block defined in patterns.md.

## Focus

- create a finite completion ledger
- mark all required features as failing until proven
- create an executable `init.sh` that starts the dev server and runs a smoke test (use the template from `references/patterns.md`)
- create both init.sh and init.bat for cross-platform support
- write `init.md` as human-readable setup documentation alongside the scripts
- record the baseline honestly

## Do Not

- edit product code
- invent roadmap scope beyond the planner's shipped scope
- mark features passing

## Checklist

1. Is the feature list finite?
2. Does state.json declare mode and active target?
3. Does progress.md tell the next agent what to do first?
