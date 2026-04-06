# Initialization Notes

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, release.json, prior .harness/ artifacts
- Status: accepted

## Context

Re-initialization for the v3.0.0 development cycle. This is a major simplification release that removes accumulated complexity from the v2.x line: structured event logging (events.jsonl), Codex detection ceremony, unused subcommands, verbose artifact names, and over-granular enums. The prior v2.2.2 cycle shipped 5 features (F-020 through F-024) covering hook integration, progress-append enforcement, round numbering verification, codex CLI standardization, and the finalize-round subcommand.

## Scope

8 features (F-025 through F-032) across 4 sprints:

| ID | Title | Sprint |
|----|-------|--------|
| F-025 | Remove events system | 1 |
| F-026 | Remove codex detection from evaluator | 1 |
| F-027 | Remove unused subcommands | 1 |
| F-028 | Standardize sprint artifact naming | 2 |
| F-029 | Consolidate root artifacts and simplify enums | 2 |
| F-030 | Auto-postmortem with drift detection | 3 |
| F-031 | Inline metrics into postmortem-data and trim SKILL.md | 3 |
| F-032 | End-to-end verification of simplified harness | 4 (conditional) |

## Execution strategy

- Variant A (sprinted), continuous mode, 3-4 expected sprints (Sprint 4 conditional)
- Sprint 1: F-025 + F-026 + F-027 (removals -- all touch harness-companion.mjs)
- Sprint 2: F-028 + F-029 (naming + enum changes -- both touch patterns.md and role files)
- Sprint 3: F-030 + F-031 (enhancements -- both touch postmortem-data)
- Sprint 4: F-032 (end-to-end verification -- conditional on whether Sprint 1-3 evaluations already cover it)
- Methodology: agile

## Dependency graph

```
F-025 (Remove events system)           -- no deps
F-026 (Remove codex detection)         -- no deps
F-027 (Remove unused subcommands)      -- no deps
F-028 (Artifact naming)                -- depends on F-025, F-026, F-027
F-029 (Consolidate artifacts + enums)  -- depends on F-025, F-026, F-027
F-030 (Auto-postmortem + drift)        -- depends on F-028, F-029
F-031 (Inline metrics + trim SKILL.md) -- depends on F-028, F-029
F-032 (End-to-end verification)        -- depends on F-030, F-031
```

## Technical baseline

- harness-companion.mjs: ~15 subcommands operational
- lib/: 7 modules (state, features, git, progress, artifacts, metrics, events)
- hooks.json: 3 hook entries
- Zero npm dependencies
- Domain profile: software

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

- `.harness/features.json` -- 8 features, F-025 through F-032, all passes: false
- `.harness/state.json` -- round 0, mode continuous, phase idle
- `.harness/progress.md` -- baseline with all 8 failing features documented
- `.harness/config.json` -- standard defaults, use_codex: auto
- `.harness/init.sh` -- smoke test script (pre-v3.0.0 baseline)
- `.harness/init.bat` -- Windows CMD equivalent
