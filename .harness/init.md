# Initialization Notes

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, release.json, prior .harness/ artifacts
- Status: accepted

## Context

Re-initialization (--force) for the v2.2.3 development cycle. The prior v2.2.2 cycle shipped 5 features (F-015 through F-019) covering script hardening, feature-update subcommand, per-step metrics, structured event logging, and the postmortem command. This cycle implements 5 postmortem-driven improvements identified during the v2.2.2 release retrospective.

## Scope

5 features (F-020 through F-024) targeting internal harness infrastructure:

| ID | Title | Sprint |
|----|-------|--------|
| F-020 | Hook integration for auto event logging | 1 |
| F-021 | Enforce progress-append via hooks | 1 |
| F-022 | Round numbering verification subcommand | 1 |
| F-023 | Standardize codex CLI review approach | 2 |
| F-024 | Add finalize-round subcommand | 2 |

## Execution strategy

- Variant A (sprinted), continuous mode, 2 expected sprints
- Sprint 1: F-020 + F-021 + F-022 (shared hooks.json / harness-companion.mjs surface)
- Sprint 2: F-023 + F-024 (documentation fix + new subcommand)
- Methodology: agile

## Technical baseline

- harness-companion.mjs: 13 subcommands operational
- lib/: 7 modules (state, features, git, progress, artifacts, metrics, events)
- hooks.json: existing hook entries present
- Zero npm dependencies
- Domain profile: software

## Dependency graph

```
F-020 (Hook integration for auto event logging) -- no deps
F-021 (Enforce progress-append via hooks) -- no deps
F-022 (Round numbering verification subcommand) -- no deps
F-023 (Standardize codex CLI review approach) -- no deps
F-024 (Add finalize-round subcommand) -- no deps
```

All features are independent. Sprint grouping is by shared file surface (Sprint 1) and by scope smallness (Sprint 2), not by dependency.

## Setup requirements

- Node.js (ESM support, v14+)
- No npm install needed (zero dependencies)
- Git (for autoCommit functionality)

## Verification

Run the smoke test:
```bash
bash .harness/init.sh
```

Or verify manually:
```bash
node plugins/harness/scripts/harness-companion.mjs help
cat .harness/features.json | node -e "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'))"
```

## Artifacts created

- `.harness/features.json` -- 5 features, F-020 through F-024, all passes: false
- `.harness/state.json` -- round 0, mode continuous, phase idle
- `.harness/progress.md` -- baseline with failing features documented
- `.harness/config.json` -- standard defaults, use_codex: auto
- `.harness/init.sh` -- smoke test script
- `.harness/init.bat` -- Windows CMD equivalent
