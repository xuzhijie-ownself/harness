# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, features.json, README.md, release.json, harness-companion.mjs, lib/state.mjs, lib/features.mjs, lib/git.mjs, lib/artifacts.mjs, lib/progress.mjs
- Status: accepted

## Overview

Harness v2.2.2 is an observability and hardening cycle for the harness-companion script layer introduced in v2.2.1. That release delivered the initial script automation (7 subcommands, 5 lib modules, zero npm dependencies). This cycle builds on that foundation in four areas:

1. **Script hardening** -- JSDoc annotations, runtime schema validation, circular dependency detection, standardized error handling, and git message escaping fixes across all existing modules.
2. **Feature-update subcommand** -- CLI-driven feature.passes/status/maturity mutation to eliminate manual JSON editing.
3. **Per-step metrics and structured event logging** -- Extend cost_tracking with file change counts and inline evaluation scores; add a JSONL event log for agent spawns, phase changes, and evaluations; add metrics-summary and log-event subcommands.
4. **Postmortem command and hook integration** -- A new `/harness:postmortem` command that synthesizes all sprint data into an actionable report, plus hooks wiring so event logging happens automatically.

The target audience is the harness itself -- these improvements make harness runs more debuggable, more robust, and self-documenting.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Code (Node.js ES modules), Markdown (command/role files), JSON/JSONL (schemas, event logs)
- Stakeholder lens: Harness operators (developers using the harness), harness maintainers

Note: visual_design criterion maps to "documentation clarity and output formatting" for this project since there is no UI. Evaluator should interpret VD scores as quality of help text, stderr messages, JSONL formatting, and generated Markdown reports.

## Shipped scope

### F-015: Script hardening
Add JSDoc type annotations to all exports across the 5 existing lib modules (state.mjs, features.mjs, git.mjs, artifacts.mjs, progress.mjs) and the entry point (harness-companion.mjs). Add runtime schema validation to `readState()` -- validate that required fields exist and have correct types: `mode` (string), `status` (string), `current_round` (number), `current_sprint_phase` (string in valid set), `cost_tracking` (object with rounds array). Add runtime schema validation to `readFeatures()` -- validate `version` (number), `features` (array), and for each feature validate `id` (string), `title` (string), `required` (boolean), `passes` (boolean). Add circular dependency detection in `selectNextFeature()` -- detect cycles in `depends_on` graphs and throw UserError with the cycle path instead of silently producing incorrect results. Standardize error handling: convert the `{ok: false, ...}` return pattern in `autoCommit()` (git.mjs line 39) and `updateTimestamp()` (progress.mjs line 61) to throw UserError instead. Fix git message escaping in `autoCommit()` -- the current implementation only escapes double quotes (`message.replace(/"/g, '\\"')`) but fails on backticks, dollar signs, single quotes, and other shell metacharacters. Switch to passing the message via `execSync`'s array-of-args pattern or use proper escaping for all shell-special characters.

### F-016: Feature-update subcommand
Add a `feature-update` subcommand to harness-companion.mjs that mutates features.json fields via CLI flags. Supported operations: `--id F-XXX --set-passes true|false`, `--id F-XXX --set-status <status>`, `--id F-XXX --set-maturity <maturity>`. Multiple `--set-*` flags may be combined in one call. Validates that the feature ID exists before mutation; throws UserError if not found. Add the implementation to a new export in features.mjs (e.g., `updateFeature()`). Uses atomic write (write to .tmp then rename) consistent with state.mjs patterns. Outputs the updated feature object as JSON to stdout.

### F-017: Per-step metrics recording
Extend `cost_tracking.rounds[].phases` objects to optionally include: `file_changes: { insertions: number, deletions: number, files_changed: number }` (parsed from `git diff --shortstat HEAD~1`) and `evaluation_scores: { <criterion>: <score> }` (copied from the round's NN-evaluation.json primary_scores). Add a `collectFileChanges()` helper in git.mjs that runs `git diff --shortstat HEAD~1` and parses the numeric output. Add a `metrics-summary` subcommand to harness-companion.mjs that reads state.json cost_tracking and aggregates across all rounds: total duration per phase type, total file changes (insertions, deletions), and score trends per criterion (array of values across rounds). Output as JSON to stdout.

### F-018: Structured event logging
Create a new lib module `plugins/harness/scripts/lib/events.mjs` that manages `.harness/events.jsonl`. Each event is a single JSON line with the schema: `{ timestamp: string (ISO 8601), event_type: string, round: number|null, feature_id: string|null, data: object }`. Supported event_type values: `agent_spawned`, `phase_changed`, `feature_selected`, `evaluation_completed`, `commit_made`, `error_logged`. The module exports `logEvent({ event_type, round, feature_id, data })` which appends a timestamped JSON line to events.jsonl (creating the file if it does not exist). Add a `log-event` subcommand to harness-companion.mjs: `--type <event_type> --round <n> --feature <id> [--data <json>]`. The `--round` and `--feature` flags are optional (default to null).

### F-019: Postmortem command
Add a new command file `plugins/harness/commands/postmortem.md` for `/harness:postmortem`. Add a role file `plugins/harness/skills/harness/roles/postmortem.md` with full instructions for the postmortem agent. The command reads all `.harness/sprints/NN-evaluation.json` files, `.harness/state.json` cost_tracking, `.harness/features.json` pass/fail state, and optionally `.harness/events.jsonl`. It generates `.harness/postmortem.md` containing five sections:
- **Timeline**: Rounds, dates (from cost_tracking timestamps), outcomes (pass/fail per round).
- **Score trends**: How primary_scores changed across rounds per criterion, including regressions.
- **Failure analysis**: Which features failed, on which rounds, why (from evaluation blockers/non_blocking_issues), how many retries before passing.
- **Process compliance**: Was spec.md present? Were all expected artifacts created per round (cross-reference with validate-artifacts logic)? Were all required features eventually addressed?
- **Recommendations**: Concrete suggestions for the next cycle based on patterns found (e.g., "Feature X required 3 retries -- consider decomposing similar features into smaller units").

The postmortem agent is spawned by the command and follows the role file as its single source of truth. Update the plugin.json manifest to register the new command.

### F-020: Hook integration for auto-logging
Update `plugins/harness/hooks/hooks.json` to call `log-event` subcommand at relevant trigger points. Update `plugins/harness/skills/harness/roles/coordinator.md` and `plugins/harness/skills/harness/roles/generator.md` (or session.md) to instruct agents to call `log-event` when: an agent is spawned (event_type: agent_spawned), a phase changes (phase_changed), a feature is selected (feature_selected), an evaluation completes (evaluation_completed), and a commit is made (commit_made). The goal is that event logging happens automatically during normal harness operation without operators needing to call log-event manually.

## User stories

- As a harness maintainer, I want JSDoc on all exports so my IDE shows parameter types and return shapes without a build step.
- As a harness operator, I want readState() and readFeatures() to fail fast with clear messages when JSON files are corrupted or missing required fields, rather than producing cryptic downstream errors.
- As a harness operator, I want circular dependencies in features.json to be detected and reported clearly instead of causing silent misbehavior in feature selection.
- As a harness operator, I want autoCommit() to throw a proper error on failure so the coordinator can handle it uniformly instead of checking for {ok: false} returns.
- As a harness operator, I want git commit messages with special characters to work correctly so feature titles containing backticks or dollar signs do not break commits.
- As a harness operator, I want to update feature passes/status/maturity from the CLI so I never have to hand-edit features.json.
- As a harness operator, I want to see file change counts and evaluation scores in cost_tracking so I can understand how much work each round produced.
- As a harness operator, I want a metrics-summary subcommand that aggregates round data so I can quickly assess a run's productivity.
- As a harness operator, I want a JSONL event log so I can grep, filter, and analyze what happened during a harness run without reading multiple Markdown files.
- As a harness operator, I want a postmortem command that synthesizes all sprint data into a single actionable report after a harness run completes.
- As a harness operator, I want events to be logged automatically during normal harness operation so I do not need to remember to call log-event manually.

## Execution strategy
- Variant: Variant A (full-stack sprinted)
- Mode: continuous
- Expected sprint count: 4
- Default target ordering: F-015 -> F-016 -> F-017 -> F-018 -> F-019 -> F-020 (dependency order then priority)
- Multi-feature sprint policy: Allow pairing features within the same concern area when they share file targets and the combined scope fits one contract. Planned groupings:
  - Sprint 1: F-015 + F-016 -- both touch lib modules and the entry point; F-016 depends on the standardized error handling patterns established by F-015.
  - Sprint 2: F-017 + F-018 -- both add new subcommands and lib code; F-018 creates events.mjs which F-017's metrics-summary can reference for enrichment.
  - Sprint 3: F-019 -- new command + role file, depends on metrics and events being available from F-017/F-018.
  - Sprint 4: F-020 -- hooks wiring, depends on F-018's log-event existing and F-019's postmortem command being registered.
- Simplification policy: If a feature fails twice consecutively, the coordinator may reduce scope to a minimum viable subset:
  - F-015: Simplify validation to required-field-existence checks only (skip type checking of individual fields).
  - F-016: Drop multi-flag combination support; require one --set-* flag per invocation.
  - F-017: Defer file_changes collection if git diff parsing proves fragile on the host platform; keep evaluation_scores inline and metrics-summary.
  - F-018: Keep core logEvent() and log-event subcommand; defer readEvents() query/filter if scope is too broad.
  - F-019: Defer the Recommendations section; ship with Timeline, Score Trends, Failure Analysis, and Process Compliance only.
  - F-020: Reduce to coordinator-only integration; defer generator/session wiring to next cycle.
- Methodology: agile (default)

## High-level technical design

### Scripts layer (plugins/harness/scripts/)
- **Entry point**: harness-companion.mjs gains 3 new subcommands (`feature-update`, `metrics-summary`, `log-event`), bringing the total to 10.
- **Existing lib modules** (all 5): Get JSDoc annotations on every export. state.mjs and features.mjs get runtime validation. git.mjs gets `collectFileChanges()` and fixed escaping in `autoCommit()`. features.mjs gets `updateFeature()` and cycle detection in `selectNextFeature()`.
- **New lib module**: `events.mjs` -- manages .harness/events.jsonl with `logEvent()` export.
- **Zero dependency constraint**: Maintained throughout. All new code uses Node.js built-ins only (fs, path, child_process).

### Command layer (plugins/harness/commands/)
- **postmortem.md**: New command file following existing command patterns (pre-flight checks, agent spawn with role reference).

### Role layer (plugins/harness/skills/harness/roles/)
- **postmortem.md**: New role file defining the postmortem agent's read sources, write targets, and report structure.

### Hooks layer (plugins/harness/hooks/)
- **hooks.json**: Updated with log-event calls on agent spawn and post-commit triggers.

### Role doc updates
- **coordinator.md**: Add log-event calls at phase transitions and after evaluations.
- **session.md or generator.md**: Add log-event calls at feature selection and agent spawn points.

### Data artifacts (.harness/)
- **events.jsonl**: New file, append-only, one JSON object per line. Created on first log-event call.
- **postmortem.md**: New generated artifact, produced by `/harness:postmortem`.
- **state.json**: cost_tracking schema extended with optional `file_changes` and `evaluation_scores` fields per phase. Backward compatible -- existing state.json files without these fields remain valid.

### Data flow
```
Agent (Bash tool) -> harness-companion.mjs -> lib/*.mjs -> .harness/*.json
                                                        -> .harness/events.jsonl
                                                        -> .harness/progress.md
                                                        -> git (via child_process)
                  <- JSON stdout (parsed by agent)

/harness:postmortem -> postmortem agent -> reads sprints/*.json, state.json,
                                          features.json, events.jsonl
                                       -> writes .harness/postmortem.md
```

## Non-goals

- **npm dependencies**: This cycle maintains the zero-dependency constraint. No package.json, no node_modules.
- **Token counting**: Per-step metrics will not attempt to count LLM tokens. This data is not reliably available from the Claude Code or Codex CLI environments. Metrics focus on what is observable: timestamps, file changes, evaluation scores.
- **Event log rotation or compaction**: events.jsonl grows unbounded within a single harness run. Log management across runs is deferred.
- **Postmortem diffing**: Comparing postmortems across releases is out of scope.
- **Test framework**: No unit test framework is introduced. Verification remains manual per the existing harness pattern (evaluator runs subcommands and inspects output).
- **Breaking schema changes**: cost_tracking extensions are additive. Existing state.json files without new fields remain valid.
- **UI or dashboard**: No visualization layer for metrics or events.
- **Windows batch equivalents**: Scripts are Node.js (.mjs), which runs cross-platform. No separate .bat files needed.
- **Changing existing artifact schemas in patterns.md**: Scripts conform to existing schemas. The postmortem.md template may be added to patterns.md but existing templates are not modified.

## Definition of done

All 6 features (F-015 through F-020) pass evaluation with scores of 3 or above on all 4 domain criteria. Specifically:

1. All 7 existing subcommands continue to work without regressions.
2. `node harness-companion.mjs --help` lists all 10 subcommands (7 existing + 3 new).
3. JSDoc `@param` and `@returns` annotations are present on all exported functions across all 6 modules.
4. `readState()` throws UserError with a descriptive message when state.json is missing required fields or has wrong types.
5. `readFeatures()` throws UserError with a descriptive message when features.json is malformed.
6. `selectNextFeature()` detects circular dependencies in the depends_on graph and throws UserError naming the cycle.
7. `autoCommit()` throws UserError on git failure instead of returning `{ok: false}`.
8. `updateTimestamp()` throws UserError when progress.md does not exist instead of returning `{ok: false}`.
9. Git commit messages containing backticks, dollar signs, and single quotes commit successfully without shell interpretation.
10. `feature-update --id F-XXX --set-passes true` atomically updates features.json and outputs the updated feature as JSON.
11. `metrics-summary` outputs JSON with per-phase duration totals, file change aggregates, and score trend arrays.
12. `log-event --type phase_changed --round 1` appends a valid JSONL line to .harness/events.jsonl.
13. `/harness:postmortem` produces .harness/postmortem.md with all 5 sections (Timeline, Score Trends, Failure Analysis, Process Compliance, Recommendations).
14. hooks.json includes log-event triggers for agent spawns and commits.
15. The postmortem command is registered in the plugin manifest.
