# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, release.json, features.json, harness-companion.mjs, hooks.json, evaluator.md, patterns.md
- Status: accepted

## Overview

Harness v3.0.0 is a major simplification release that removes accumulated complexity from the v2.x line. The harness has grown three systems that no longer justify their maintenance cost: structured event logging (events.jsonl), Codex detection ceremony, and several subcommands that duplicated or underused functionality. This release removes them, standardizes artifact naming for readability, consolidates root artifacts and enum values, and adds lightweight automation (auto-postmortem with drift detection).

The target audience remains the same: AI agents operating under the harness workflow. The goal is a leaner harness that is faster to read, easier to maintain, and breaks fewer ways.

This is a breaking release. Artifact filenames change, enum values shrink, and three subsystems are deleted. The major version bump signals these incompatibilities.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Code (Node.js scripts), Markdown (role files, reference files, templates), JSON (schemas, config)
- Stakeholder lens: Harness users (AI agents and human operators), harness maintainers

Note: "visual_design" maps to documentation clarity and configuration readability for this infrastructure cycle.

## Design direction

Minimalism. Every removal should make the remaining system more coherent. No new abstractions are introduced -- only consolidations and deletions. Naming changes follow a consistent short-suffix pattern (proposal, review, report, eval). Enum simplifications collapse states that were never meaningfully distinguished in practice.

## Shipped scope

### Sprint 1 -- Removals

**F-025: Remove events system**
- Delete `plugins/harness/scripts/lib/events.mjs`
- Remove `log-event` and `read-events` entries from SUBCOMMANDS map in `harness-companion.mjs`
- Remove the `import { logEvent, readEvents } from './lib/events.mjs'` line from `harness-companion.mjs`
- Remove 2 event hooks from `hooks.json` (ids: `post:bash:harness-log-phase`, `post:agent:harness-log-spawn`); keep only the `post:bash:harness-progress-update` hook
- Remove events.jsonl references from `postmortem-data` case block in `harness-companion.mjs`
- Remove events.jsonl from any role file references (coordinator.md, session.md)

**F-026: Remove codex detection from evaluator**
- Remove Section 0 "Code Review Pre-Flight (MANDATORY)" from `evaluator.md`
- Remove "Codex Detection Detailed Procedure" section from `references/advanced.md` (lines 96 to end)
- Remove `codex_detection` object from `review_findings` in the NN-evaluation.json schema in `patterns.md`
- Remove codex detection enforcement from `coordinator.md` (any instructions that reference codex pre-flight as mandatory)
- Replace all removed content with a 2-line runtime-agnostic note: "If a code review plugin is available, the evaluator MAY invoke it. Record whether external review was used in review_findings.review_mode."
- Simplify `review_findings` in patterns.md to: `{ "review_mode": "string", "blocking": [], "non_blocking": [] }`
- Remove `use_codex` field from config.json schema in patterns.md

**F-027: Remove unused subcommands**
- Remove `feature-update` from SUBCOMMANDS map and delete `updateFeature` / `writeFeatures` exports from `lib/features.mjs` (the coordinator calls feature-select and check-stop; direct feature mutation is fragile)
- Remove `verify-round-numbering` from SUBCOMMANDS map and delete its case block
- Remove `metrics-summary` from SUBCOMMANDS map (its logic will be inlined into postmortem-data in Sprint 3)
- Update dispatch logic in `harness-companion.mjs` to remove dead cases
- Remove the `import { ..., updateFeature } from './lib/features.mjs'` named import

### Sprint 2 -- Naming and Consolidation

**F-028: Standardize sprint artifact naming**
- Rename pattern in all references:
  - `NN-contract.md` becomes `NN-proposal.md`
  - `NN-contract-review.md` becomes `NN-review.md`
  - `NN-builder-report.md` becomes `NN-report.md`
  - `NN-evaluation.md` becomes `NN-eval.md`
  - `NN-evaluation.json` becomes `NN-eval.json`
- Update file list in patterns.md "Shared Artifact Layout"
- Update all templates in patterns.md that reference old names
- Update `validate-artifacts` in `lib/artifacts.mjs` to check for new filenames
- Update `postmortem-data` to read `NN-eval.json` instead of `NN-evaluation.json`
- Update `finalize-round` to read `NN-eval.json`
- Update role files: `evaluator.md` (Write section), `generator.md` (Write section), `coordinator.md` (artifact references), `session.md` (workflow steps)
- Update SKILL.md if it references artifact names

**F-029: Consolidate root artifacts and simplify enums**
- Remove `init.md` from artifact layout in patterns.md (init.sh/init.bat are sufficient boot scripts)
- Remove `summary.md` from artifact layout (merge its purpose into the final progress.md entry)
- Remove `decomposition.md` from artifact layout and its template from patterns.md (inline its content into spec.md execution strategy section)
- Simplify feature `status` enum: collapse `not_started/in_progress/done/complete` to `pending/done`
- Simplify feature `maturity` enum: collapse `draft/functional/reviewed/polished/accepted` to `draft/reviewed/accepted`
- Remove `supervised-step` alias from `mode` in state.json (keep only `continuous` and `supervised`)
- Update patterns.md schemas for features.json and state.json
- Update `lib/features.mjs` validation to accept new enum values
- Update role files that reference old enum values
- Update planner.md to remove reference to decomposition.md

### Sprint 3 -- Enhancements

**F-030: Auto-postmortem with drift detection**
- Coordinator auto-calls `postmortem-data` when `check-stop` returns `all_required_pass`
- `postmortem-data` uses `git log --oneline` for timeline reconstruction instead of events.jsonl (which no longer exists after Sprint 1)
- `finalize-round` adds a `drift_warning` field to its output JSON if any criterion score drops by more than 1 between consecutive rounds (reads prior NN-eval.json for comparison)
- `/harness:release` checks that `postmortem.md` exists before allowing release (add guard to releaser.md)

**F-031: Inline metrics into postmortem-data and trim SKILL.md**
- Delete `lib/metrics.mjs` entirely
- Move `summarizeMetrics` logic into the `postmortem-data` case block in `harness-companion.mjs` (inline, no separate module)
- Remove `import { collectMetrics, summarizeMetrics, recordMetrics, readMetrics } from './lib/metrics.mjs'` from `harness-companion.mjs`
- Trim SKILL.md by removing content that is duplicated verbatim in role files (target: reduce by 100-150 lines)
- Verify only 1 hook remains in hooks.json (`post:bash:harness-progress-update`)

### Sprint 4 -- Verification (conditional)

**F-032: End-to-end verification of simplified harness**
- Run each remaining subcommand with representative inputs and verify correct JSON output
- Verify new artifact naming works with `validate-artifacts --round 1`
- Verify `postmortem-data` auto-triggers correctly when `check-stop` returns completion
- Verify `finalize-round` drift detection produces `drift_warning` when score drops >1
- Verify simplified enum values (`pending/done`, `draft/reviewed/accepted`) work across all `features.json` operations
- Verify hooks.json has exactly 1 hook entry
- This sprint is conditional: skip if Sprints 1-3 evaluations already cover these verifications

## User stories

- As a harness maintainer, I want fewer moving parts so that debugging a stuck sprint requires reading less code.
- As an AI agent, I want shorter role files so that my context window has more room for the actual project.
- As a harness user, I want artifact names that are short and self-explanatory (proposal, review, report, eval) instead of verbose and ambiguous (contract, contract-review, builder-report, evaluation).
- As a harness user, I want feature status to be binary (pending/done) because the intermediate states were never reliably distinguished.
- As a releaser, I want postmortem.md to be auto-generated so I do not have to remember to run it manually.

## Execution strategy
- Variant: Variant A (sprinted, single generate-evaluate loop per round)
- Mode: continuous
- Expected sprint count: 3-4 (Sprint 4 is conditional on whether Sprint 1-3 evaluations already verify end-to-end correctness)
- Default target ordering: F-025, F-026, F-027 (Sprint 1) -> F-028, F-029 (Sprint 2) -> F-030, F-031 (Sprint 3) -> F-032 (Sprint 4 if needed)
- Multi-feature sprint policy: Features within the same sprint are grouped because they share edit surfaces and are logically coupled. Sprint 1 groups three removals that all touch harness-companion.mjs. Sprint 2 groups naming + enum changes that both touch patterns.md and role files. Sprint 3 groups two enhancements that both touch postmortem-data. Grouping waiver required in each contract.
- Simplification policy: If Sprint 4 verification reveals issues, fix them in-sprint rather than adding a Sprint 5. If a Sprint 1-3 feature blocks unexpectedly, the coordinator may defer it to the next sprint but must not silently drop it.
- Methodology: agile

## High-level technical design

- **Scripts**: `harness-companion.mjs` is the single entry point. After v3.0.0, it will have ~10 subcommands (down from 15). Two library modules are deleted (`events.mjs`, `metrics.mjs`). Remaining libs: `features.mjs`, `state.mjs`, `git.mjs`, `artifacts.mjs`, `progress.mjs`.
- **Role files**: All 6 role files are touched for codex removal (evaluator.md), artifact renaming (all), and enum updates (coordinator.md, generator.md). The evaluator gets significantly shorter.
- **Schemas**: `patterns.md` is the central schema file. It gets updated for artifact layout, evaluation JSON schema, features.json schema, and template names.
- **Hooks**: `hooks.json` shrinks from 3 hooks to 1.
- **Data flow after v3.0.0**: No events.jsonl. Timeline comes from git log. Metrics are inline in postmortem-data. Progress.md is the single append-only log.

## Non-goals

- Adding new features or capabilities beyond what exists in v2.2.x (this is a simplification release)
- Changing the core sprint loop (generate -> evaluate -> coordinate)
- Removing the authenticity gate
- Changing the 0-5 scoring rubric or the 4-criteria evaluation model
- Modifying the domain skill suite (harness-sdlc-suite) -- only the core harness plugin is in scope
- Backward compatibility with v2.x artifact names (this is a major version bump)
- Changing config.json schema beyond removing `use_codex` field
- Adding npm dependencies
- Adding a test framework (evaluator agent performs verification)

## Definition of done

1. `lib/events.mjs` and `lib/metrics.mjs` do not exist
2. `hooks.json` contains exactly 1 hook
3. `harness-companion.mjs` has no imports from deleted modules and no dead subcommand entries
4. Evaluator.md has no Section 0 codex pre-flight; replaced with 2-line runtime-agnostic note
5. All artifact references across role files and patterns.md use new names (proposal, review, report, eval)
6. `features.json` schema in patterns.md uses `pending/done` status and `draft/reviewed/accepted` maturity
7. `decomposition.md`, `init.md`, and `summary.md` removed from artifact layout
8. `postmortem-data` uses git log for timeline and includes inlined metrics summary
9. `finalize-round` includes drift detection (drift_warning when score drops >1)
10. Coordinator auto-calls postmortem-data on completion; releaser guards on postmortem.md existence
11. All remaining subcommands produce correct JSON output when invoked
12. No dead imports, no references to deleted files, no orphaned code paths
13. Zero npm dependencies maintained

## Risks

- **Edit surface breadth**: Artifact renaming (F-028) touches nearly every file in the harness. A missed reference will cause runtime failures. Mitigation: grep-based verification pass in each evaluation.
- **Enum migration**: Changing status/maturity values (F-029) could break any external tooling that reads features.json. Mitigation: this is a major version bump; document the breaking change in CHANGELOG.md.
- **Inlining metrics**: Moving summarizeMetrics into postmortem-data (F-031) risks bloating a single case block. Mitigation: keep the inlined logic under 50 lines; if it exceeds that, extract to a local function within harness-companion.mjs rather than a separate module.
- **Sprint ordering dependency**: Sprints 2-3 assume Sprint 1 removals are complete (e.g., postmortem-data no longer reads events.jsonl). If Sprint 1 partially fails, Sprint 2-3 contracts must account for residual code.
