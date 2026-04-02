# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, floofy-scribbling-eagle.md plan, SKILL.md, patterns.md, agents/evaluator.md, agents/coordinator.md, README.md
- Status: accepted

## Overview

Harness Plugin v3 enhances the long-running-harness plugin with 11 features that make it production-ready. The plugin is a Markdown/JSON/shell content system -- no compiled code. All changes are edits to existing `.md` and `.json` files within the plugin tree (`skills/`, `agents/`, `README.md`), plus one new runtime artifact template (`config.json`).

The target user is a developer or technical lead who uses the harness plugin to orchestrate multi-agent sprint loops in Claude Code or Codex. v3 adds configurable behavior (Codex toggle, context reset threshold, config file), richer evaluation (subjective grading framework, feature maturity levels, sprint retrospectives), cross-domain applicability (domain profiles with BA foundation), and structural improvements (feature dependencies, cost tracking, GAN docs, cross-platform init).

## Design direction

Content-first: every enhancement is expressed as Markdown prose additions, JSON schema extensions, or shell script templates. No TypeScript, no build tooling, no package management. Quality means: correct Markdown structure, valid JSON schemas, internally consistent cross-references, and a passing `bash artifacts/init.sh` smoke test.

## Shipped scope

### E-006: GAN Pattern Documentation
Add "GAN Pattern" section to `SKILL.md` and `README.md` explaining the adversarial generator/evaluator design, why the generator cannot self-approve, and how the loop iterates until acceptance.

### E-007: Cross-Platform Init
Update `agents/initializer.md` and `roles/initializer.md` to generate both `init.sh` and `init.bat`. Update `SKILL.md` artifact list to reference both scripts.

### E-004: Configurable Context Reset Threshold
Add `context_reset_threshold` field (default 3) to `state.json` schema in `patterns.md`. Update coordinator to read this field instead of using a hardcoded value. Update `SKILL.md` to document the field.

### E-005: Cost Tracking Implementation
Update `agents/coordinator.md` and `roles/coordinator.md` to record ISO timestamps at each phase boundary into `state.json.cost_tracking.rounds[]`.

### E-011: Harness Configuration File
Add `.harness/config.json` schema to `patterns.md` with fields: `use_codex`, `context_reset_threshold`, `auto_commit`, `auto_retro`, `retro_interval`, `max_retry_on_failure`, `evaluator_strictness`, `commit_prefix_pass`, `commit_prefix_fail`, `commit_tag`. Update `agents/initializer.md` to create default config. Update coordinator and evaluator to read from config.

### E-001: Codex Review Toggle
Add `use_codex` field (`auto`/`off`/`on`) to config.json (primary) and state.json (legacy). Update evaluator to check this field before Codex detection. Update `commands/init.md` with optional prompt. Update initializer to include the field.

### E-003: Feature Dependencies
Add `depends_on` field (array of feature IDs) to `features.json` schema in `patterns.md`. Update coordinator to skip dependency-blocked features when selecting the next target.

### E-010: Feature Maturity Levels
Add `maturity` field (`draft`/`functional`/`reviewed`/`polished`/`accepted`) to `features.json` schema. Update evaluator to set maturity based on scores. Update `SKILL.md` with maturity level documentation.

### E-002: Cross-Domain Profiles with BA Foundation
Add domain profile system to `SKILL.md` with 7 built-in profiles (software, architecture, tender, research, content, business_analysis, custom). Add `domain_profile`, `secondary_profile` to state.json schema. Add `source_requirement` to features.json. Update planner, evaluator, init command, and README. Generalize hardcoded evaluation criteria to be profile-driven.

### E-008: Subjective Quality Grading Framework
Add rubric anchor system to `SKILL.md` and `patterns.md`. Enhance `NN-evaluation.json` schema with `justification`, `prior_round_score`, `drift_check` fields. Add `evaluator-calibration.md` template with anchor structure. Update evaluator for calibration creation on round 1 and comparative scoring. Update coordinator for calibration enforcement.

### E-009: Sprint Retrospective and Learning Loop
Add retrospective template to `patterns.md`. Update coordinator to generate retrospectives every N rounds (configurable via `retro_interval` in config.json) or after a FAIL. Store as `.harness/sprints/retro-RX-RY.md`. Coordinator reads latest retro before starting the next round.

## User stories

- As a plugin user on Windows, I want `init.bat` generated alongside `init.sh` so I can run the harness natively without Git Bash.
- As a user without Codex access, I want to set `use_codex: off` so the evaluator does not attempt Codex calls that will fail.
- As an enterprise architect, I want to select the `architecture` domain profile so evaluation criteria match my deliverables (ADRs, capability maps) instead of software criteria (visual_design, code_quality).
- As a coordinator operator, I want feature dependencies so F-003 is not targeted before its prerequisite F-001 passes.
- As a long-running harness user, I want cost tracking timestamps populated automatically so I can audit time spent per sprint phase.
- As a user tuning the harness, I want a single `config.json` file for all persistent preferences instead of hunting through state.json and spec.md.
- As an evaluator, I want rubric anchors and drift detection so my scores stay calibrated across 10+ rounds.
- As a project lead, I want feature maturity levels (draft through accepted) so I can see readiness beyond binary pass/fail.
- As a coordinator, I want sprint retrospectives so repeated mistakes are captured and fed back into future rounds.
- As a new user, I want GAN pattern documentation so I understand why generator and evaluator are separated.
- As a user with variable project complexity, I want configurable context reset threshold so short projects do not reset unnecessarily.

## Execution strategy

- **Variant**: A (Full-Stack Sprinted Harness)
- **Mode**: continuous
- **Expected sprint count**: 11 sprints, one feature per sprint
- **One-sprint rationale**: N/A -- multi-sprint execution required for 11 features
- **Methodology**: agile (default)
- **Default target ordering**: Phase-ordered from the plan, lowest-risk first:
  1. E-006 (GAN docs) -- no dependencies, documentation only
  2. E-007 (cross-platform init) -- very low risk, isolated files
  3. E-004 (reset threshold) -- very low risk, schema + coordinator
  4. E-005 (cost tracking) -- very low risk, coordinator only
  5. E-011 (config file) -- low risk, creates the config foundation
  6. E-001 (Codex toggle) -- low risk, depends on E-011 config.json existing
  7. E-003 (dependencies) -- low risk, schema + coordinator
  8. E-010 (maturity levels) -- low risk, schema + evaluator
  9. E-002 (domain profiles) -- medium risk, touches many files, depends on E-008 generalized criteria
  10. E-008 (subjective grading) -- medium risk, new evaluation patterns
  11. E-009 (sprint retrospective) -- medium risk, depends on E-011 for retro_interval config
- **Multi-feature sprint policy**: one feature per sprint by default. No grouping unless two features share the exact same file set and a grouping waiver is written in the contract.
- **Simplification policy**: not justified. Each enhancement is a bounded content edit. Sprint decomposition adds value because features have inter-dependencies (E-001 depends on E-011, E-009 depends on E-011, E-002 interacts with E-008) and incremental verification catches cross-reference errors early.

## High-level technical design

- **Content type**: Markdown (`.md`), JSON schema examples, shell scripts (`.sh`, `.bat`)
- **No build system**: there is no compiler, bundler, or package manager. "Build" means all files exist, all JSON examples parse, no stale cross-references remain, and `bash artifacts/init.sh` passes.
- **File scope**: all edits are within the plugin directory tree:
  - `skills/harness/SKILL.md`
  - `skills/harness/references/patterns.md`
  - `skills/harness/roles/*.md`
  - `agents/*.md`
  - `commands/init.md`
  - `README.md`
- **Verification**: `bash artifacts/init.sh` as the build smoke test. Manual grep checks for stale hardcoded criteria, missing schema fields, and broken cross-references.

## Non-goals

- Implementing a runtime config loader (config.json is a schema template, not executable code)
- Adding new agents (the 6-agent model is stable)
- Changing the plugin install mechanism (install.sh / install.bat)
- TypeScript or compiled code of any kind
- Automated testing framework (verification is manual grep + init.sh)
- Backward-incompatible changes to existing artifact schemas (all new fields are additive)
- UI, CLI tooling, or interactive prompts beyond what init.md already supports

## Definition of done

All 11 enhancements are integrated into the plugin files. Specifically:

1. `SKILL.md` contains GAN Pattern section, domain profiles section, maturity levels, configurable reset threshold, subjective grading framework, and retrospective documentation
2. `patterns.md` contains updated schemas: `config.json`, `features.json` with `depends_on` + `maturity` + `source_requirement`, `state.json` with `context_reset_threshold` + `domain_profile` + `secondary_profile`, `NN-evaluation.json` with `justification` + `prior_round_score` + `drift_check`, `evaluator-calibration.md` template, retrospective template
3. `agents/coordinator.md` handles dependencies, cost tracking timestamps, configurable reset threshold, calibration enforcement, and retrospective generation
4. `agents/evaluator.md` checks `use_codex` config, sets maturity levels, creates calibration anchors on round 1, performs comparative scoring
5. `agents/initializer.md` generates both `init.sh` and `init.bat`, creates default `config.json`
6. `agents/planner.md` supports domain profile selection and BA-aware spec generation
7. `README.md` includes GAN pattern explanation and domain profile table
8. `commands/init.md` includes domain profile and Codex toggle prompts
9. No hardcoded evaluation criteria remain as the sole option (software defaults exist but profiles override)
10. All JSON schema examples in `patterns.md` parse as valid JSON
11. `bash artifacts/init.sh` passes without errors
