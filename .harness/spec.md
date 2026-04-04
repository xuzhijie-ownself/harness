# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, README.md, harness-companion.mjs, lib/state.mjs, lib/features.mjs, lib/git.mjs, lib/progress.mjs, lib/artifacts.mjs, release.json, plugin.json
- Status: accepted

## Overview

Harness v2.2.1 shipped the companion script layer (harness-companion.mjs) with 7 subcommands and 5 lib modules. The scripts work but have gaps: no type annotations, no runtime validation of JSON payloads, shell-string git commands vulnerable to injection, inconsistent error handling patterns, and no observability beyond progress.md. This cycle hardens the foundation, adds missing mutation commands, introduces structured metrics and event logging, and caps it with a postmortem command that synthesizes all observability data into actionable retrospectives.

Target audience: harness plugin developers and AI agents consuming JSON stdout from the companion script.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Code (.mjs modules), JSON schemas, CLI subcommands, Markdown commands
- Stakeholder lens: Plugin developers, AI agent consumers, harness maintainers

## Design direction

Maintain the zero-dependency, pure-Node.js ESM style already established. All new code uses JSDoc for editor-time type safety without introducing a build step. Runtime validation uses lightweight hand-written schema checks -- no Zod, no Ajv. New subcommands follow the existing pattern: JSON to stdout, structured errors to stderr, exit codes 0/1/2. Event log uses append-only JSONL for crash safety. The postmortem command is a Markdown skill command, not a script subcommand, because it requires LLM synthesis.

## Shipped scope

### F-015: Script hardening
- JSDoc type annotations on all exports across state.mjs, features.mjs, git.mjs, progress.mjs, artifacts.mjs
- Runtime schema validation in readState() -- verify required fields (mode, status, variant, current_round, current_sprint_phase) exist and have correct types before returning
- Runtime schema validation in readFeatures() -- verify version field is number, features is array, each feature has id (string), required (boolean), passes (boolean)
- Circular dependency detection in selectNextFeature() -- detect cycles in depends_on graphs and report them as errors instead of silently looping
- Standardize error handling: autoCommit() in git.mjs throws UserError on failure instead of returning {ok: false}; updateTimestamp() in progress.mjs throws UserError instead of returning {ok: false}
- Fix git message escaping: replace execSync shell string with spawnSync using args array to prevent injection through commit message content

### F-016: Feature-update subcommand
- New `feature-update` subcommand in harness-companion.mjs
- Flags: `--id F-XXX --set-passes true|false [--set-status done] [--set-maturity reviewed]`
- New writeFeatures() function in features.mjs using the same atomic write pattern (write to .tmp, rename) as writeState()
- New updateFeature() function in features.mjs that reads, validates, mutates a single feature by ID, and writes back
- Validation: unknown feature ID throws UserError; invalid maturity value throws UserError

### F-017: Per-step metrics
- New lib/metrics.mjs module with recordMetrics() and readMetrics()
- Enhance cost_tracking round entries with: file_changes (from git diff --shortstat: files changed, insertions, deletions), evaluation_scores (copy of primary_scores from evaluation.json)
- New `metrics-summary` subcommand that reads all rounds from state.json cost_tracking and outputs aggregated totals: total rounds, total duration, total file changes, score trends per criterion
- Atomic write via existing writeState() for metric data embedded in cost_tracking

### F-018: Structured event logging
- New lib/events.mjs with logEvent(type, payload) and readEvents(filter?)
- Append-only .harness/events.jsonl -- one JSON object per line, each with timestamp, event_type, and payload
- Event types: agent_spawned, phase_changed, feature_selected, evaluation_completed, commit_made
- New `log-event` subcommand: `--type <event_type> --payload <json>`
- New `read-events` subcommand: `[--type <filter>] [--since <iso-date>]`
- File-level append (no read-modify-write) for crash safety

### F-019: Postmortem command
- New plugins/harness/commands/postmortem.md command file
- Reads: all evaluation artifacts (.harness/sprints/*-evaluation.json), state.json, features.json, events.jsonl
- Generates .harness/postmortem.md containing: Timeline (from events.jsonl), Score Trends (from evaluation.json files), Failure Analysis (rounds that failed and why), Process Compliance (artifact completeness, contract coverage), Recommendations (patterns for improvement)
- Register postmortem.md in plugin.json commands array
- The command file instructs the agent on how to gather and synthesize -- the LLM does the synthesis, the script layer provides the data

## User stories

- As a harness maintainer, I want JSDoc types on all lib exports so my editor shows parameter types and return shapes without running TypeScript.
- As a coordinator agent, I want readState() and readFeatures() to throw clear errors when JSON is malformed or missing fields, so I get actionable error messages instead of downstream undefined-property crashes.
- As a coordinator agent, I want selectNextFeature() to detect circular dependencies and report them explicitly, so I do not get stuck in infinite target-selection loops.
- As a coordinator agent, I want autoCommit() to throw UserError on git failures so the companion script exits with code 1 and the agent sees a structured error.
- As a harness maintainer, I want git commit messages constructed via spawnSync args array so that user-provided titles cannot inject shell commands.
- As a coordinator agent, I want a feature-update subcommand so I can mark features as passing without manually editing features.json.
- As a harness maintainer, I want per-round file_changes and evaluation_scores in cost_tracking so I can track productivity trends across sprints.
- As a harness maintainer, I want a metrics-summary subcommand that aggregates all rounds into a single JSON report.
- As a coordinator agent, I want structured event logging so that every significant orchestration action is recorded with timestamps for postmortem analysis.
- As a harness user, I want a /harness:postmortem command that reads all sprint artifacts and generates a synthesized retrospective with timeline, score trends, failure analysis, and recommendations.

## Execution strategy
- Variant: Variant A (sprinted, single generate-evaluate loop per round)
- Mode: continuous
- Expected sprint count: 3
- Sprint 1: F-015 + F-016 (foundation -- hardening enables safe feature mutation)
- Sprint 2: F-017 + F-018 (observability -- metrics and events, independent of each other, both depend on hardened lib)
- Sprint 3: F-019 (postmortem command -- depends on F-017 metrics data and F-018 event log)
- Default target ordering: dependency order, then priority. F-015 first (no deps), F-016 second (benefits from hardened features.mjs), F-017 and F-018 parallel (both depend on F-015), F-019 last (depends on F-017 + F-018).
- Multi-feature sprint policy: Sprints 1 and 2 each target 2 features because the pairs are tightly coupled (hardening + mutation; metrics + events) and testing them together reduces integration risk. Grouping waiver required in contracts.
- Simplification policy: If a feature repeatedly fails, simplify its scope within the feature boundary. Do not drop features. Specifically: F-017 may drop score-trend aggregation if duration tracking alone passes; F-019 may generate a simpler postmortem without the Recommendations section if synthesis proves unreliable.

## High-level technical design

### Runtime
- Node.js ESM (.mjs), zero npm dependencies
- All new modules follow the established pattern: pure functions, atomic file writes, JSON stdout
- JSDoc annotations use @typedef and @param/@returns -- no .d.ts files, no build step

### New modules
- `plugins/harness/scripts/lib/metrics.mjs` -- recordMetrics(), readMetrics(), summarizeMetrics()
- `plugins/harness/scripts/lib/events.mjs` -- logEvent(), readEvents()

### Modified modules
- `plugins/harness/scripts/lib/state.mjs` -- add schema validation in readState(), add JSDoc
- `plugins/harness/scripts/lib/features.mjs` -- add schema validation in readFeatures(), add writeFeatures(), updateFeature(), circular dep detection in selectNextFeature(), add JSDoc
- `plugins/harness/scripts/lib/git.mjs` -- replace execSync shell string with spawnSync args array, throw UserError on failure, add JSDoc
- `plugins/harness/scripts/lib/progress.mjs` -- throw UserError in updateTimestamp(), add JSDoc
- `plugins/harness/scripts/lib/artifacts.mjs` -- add JSDoc
- `plugins/harness/scripts/harness-companion.mjs` -- register feature-update, metrics-summary, log-event, read-events subcommands

### New command
- `plugins/harness/commands/postmortem.md` -- registered in plugin.json

### Data formats
- events.jsonl: `{"timestamp":"ISO","event_type":"agent_spawned","payload":{...}}`
- metrics in cost_tracking.rounds[]: add `file_changes: {files:N, insertions:N, deletions:N}` and `evaluation_scores: {...}` fields
- postmortem.md: Markdown with Timeline, Score Trends, Failure Analysis, Process Compliance, Recommendations sections

## Definition of done
- All 5 lib modules have JSDoc @typedef and @param/@returns on every exported function
- readState() and readFeatures() throw UserError with descriptive message when required fields are missing or wrong type
- selectNextFeature() detects and reports circular dependencies
- autoCommit() uses spawnSync with args array (no shell string); throws UserError on failure
- updateTimestamp() throws UserError when progress.md is missing
- feature-update subcommand reads, validates, mutates, and atomically writes features.json
- metrics-summary subcommand outputs aggregated JSON from cost_tracking
- log-event subcommand appends to events.jsonl; read-events subcommand reads and filters
- postmortem.md command registered in plugin.json, generates .harness/postmortem.md with all 5 sections
- Zero npm dependencies maintained
- All existing subcommands continue to work (no regressions)

## Non-goals
- TypeScript migration or .d.ts generation
- npm dependency additions (Zod, Ajv, etc.)
- UI or dashboard for metrics visualization
- Real-time event streaming or WebSocket support
- Changes to the 6 agent role files or domain skill suite
- Changes to the evaluation criteria or rubric
- Backward-incompatible changes to state.json or features.json schema (new fields are additive)
- Test framework setup (validation is done by the evaluator agent via manual verification)
