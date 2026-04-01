# Product Spec: Harness Plugin Enhancement

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, floofy-scribbling-eagle.md plan, all existing plugin files (18 files)
- Status: accepted

## Overview

The long-running-harness plugin is a Claude Code and Codex dual-mode plugin that implements Anthropic's multi-agent sprint orchestration patterns. It ships as pure Markdown, JSON, YAML, and shell scripts with no compiled code. After 14 sprints of real-world usage on the SingPost project, several gaps emerged: no auto-commit, no versioning, no testing strategy, no code review gate, command name collisions with other plugins, and reliability issues including API errors, context exhaustion, and skipped evaluator phases.

This enhancement project renames the plugin to `harness`, adds namespaced commands, introduces four new agent roles (tester, reviewer, releaser, architect), adds auto-commit and versioning workflows, supports development methodology selection, and fixes the reliability bugs observed during real usage.

The target user is a developer using Claude Code or Codex who wants to run multi-sprint autonomous coding sessions with auditable quality gates.

## Design direction

No visual UI exists. All artifacts are Markdown, JSON, and YAML files consumed by Claude Code, Codex, or the developer. The design direction is: clear file naming, predictable paths (`.harness/` instead of `artifacts/`), standardized feature IDs (`F-XXX`), and namespaced commands (`/harness:*`) that do not collide with other plugins.

## Shipped scope

Ten required features, each corresponding to a phase from the enhancement plan.

### F-001: Naming and Path Migration
Rename the plugin from `long-running-harness` to `harness`. Namespace all commands with the `harness:` prefix. Rename artifact files (`feature-list.json` to `features.json`, `run-state.json` to `state.json`). Move the artifact folder from `artifacts/` to `.harness/`. Standardize feature ID format to `F-XXX`. Update all 18+ files with new paths, names, and references.

### F-002: Migration Command
New `/harness:migrate` command that detects old-format projects (`artifacts/` dir, `feature-list.json`, `feature-NNN` IDs) and migrates them to the new format. Every other command gains a migration check at the top that warns the user if old format is detected.

### F-003: Auto-Commit After Sprint
After each sprint evaluation, auto-commit with a conventional commit message: `feat(F-XXX): <title> -- sprint N [harness]` for pass, `wip(F-XXX): <title> -- sprint N attempt [harness]` for fail. Update coordinator agent, generator agent, and session command.

### F-004: Release and Versioning
New `releaser` agent and role. New `/harness:release` command. New artifacts: `.harness/release.json` (version tracking with shipped features per release) and `.harness/changelog.md` (auto-generated). Coordinator spawns releaser after all required features pass. Git tag created on release.

### F-005: Development Methodology Selection
During `/harness:init`, prompt the user to choose a methodology: agile (default), waterfall, scrum, or kanban. Store the choice in `state.json`. Planner generates methodology-aware specs. SKILL.md documents the methodology mappings.

### F-006: Testing Strategy
New `tester` agent and role. `test-plan.md` artifact generated during init. `NN-test-report.md` per sprint. Updated sprint flow: generator implements, tester writes and runs tests, then evaluator grades. Evaluator gains new contract checks: `TEST-01` (tests exist) and `TEST-02` (tests pass).

### F-007: Code Review and Codex Integration
New `reviewer` agent and role. Auto-detect codex plugin in `.claude/settings.json`. When available, use `/codex:adversarial-review` on git diff. When not available, perform Claude-based code review. `NN-review.md` artifact per sprint. Reviewer runs after tester, before evaluator.

### F-008: Architect Role
New `architect` agent and role. Design review for complex projects (more than 10 features). `.harness/architecture.md` artifact. Spawned during init when project complexity warrants it. This role is optional and brackets-activated.

### F-009: Reliability Fixes
Seven sub-items:
1. API error retry: coordinator retries failed agent spawns once after 30s delay, pauses on retry failure
2. Context freshness: after every 3 rounds, write handoff and pause for re-spawn
3. Sprint resume: `current_sprint_phase` field in state.json, session command resumes from correct phase
4. Evaluator enforcement: coordinator must not update features.json directly, must validate evaluation artifacts exist before advancing
5. Sprint artifact enforcement: contract.md, evaluation.md, evaluation.json must all exist before advancing
6. Cost and duration tracking: per-round timestamps in state.json
7. Cross-platform init: generate both init.sh and init.bat, detect Windows in init.sh

### F-010: Install and Metadata Update
Updated install.sh and install.bat with new paths and all new files. Updated plugin.json (name=harness, version=0.2.0). Updated openai.yaml. Full README rewrite. Add `--uninstall` flag to remove old artifacts.

## User stories

- As a developer, I want commands namespaced with `harness:` so they do not collide with other plugins I have installed.
- As a developer migrating from the old plugin, I want `/harness:migrate` to convert my existing `artifacts/` directory to the new `.harness/` format without losing data.
- As a developer, I want each sprint to auto-commit so my work is never at risk of being lost during long runs.
- As a developer, I want to cut a release with changelog and version tags after completing a development cycle.
- As a developer, I want to choose my preferred development methodology during init so the harness adapts to my team's workflow.
- As a developer, I want the harness to generate and run tests so features are verified beyond manual QA.
- As a developer with the Codex plugin installed, I want automated adversarial code review integrated into the sprint cycle.
- As a developer on a complex project, I want an architecture review agent to help with design decisions.
- As a developer, I want the harness to handle API errors, context exhaustion, and interrupted sprints gracefully instead of crashing.
- As a developer, I want the install script to set up all new files and support uninstallation.

## Execution strategy

- **Variant**: Variant A (Full-Stack Sprinted Harness)
- **Mode**: continuous
- **Expected sprint count**: 10 sprints, one per feature, ordered by dependency chain
- **Default target ordering**: F-001 (naming, foundation for all else) then F-010 (install, keep pipeline working) then F-002 (migration) then F-003 (auto-commit) then F-009 (reliability) then F-004 (versioning, builds on auto-commit) then F-006 (testing) then F-007 (code review) then F-005 (methodology) then F-008 (architect, optional enhancement)
- **Multi-feature sprint policy**: One feature per sprint by default. Grouping is allowed only when two features share tight coupling that makes splitting them riskier (e.g., F-001 naming changes are a prerequisite woven into F-010 install updates). If grouped, the contract must include a grouping waiver with explicit justification.
- **Simplification policy**: Not justified at project start. This is a file-editing project with no build step, runtime, or external dependencies. Sprint decomposition is load-bearing because each feature touches overlapping files and incorrect ordering would create cascading path errors. Simplification may be considered only if three consecutive sprints pass without evaluator findings, indicating the remaining features are trivial.

### Build verification

There is no compiled build. "Build" verification for this project means:
1. All files exist at their expected paths after changes
2. All internal path references in Markdown files point to files that exist
3. `install.sh` runs without errors (bash syntax check)
4. JSON files are valid JSON
5. No references to old paths (`artifacts/`, `feature-list.json`, `run-state.json`, `long-running-harness`) remain in renamed files

### Sprint cadence rationale

Ten sprints is appropriate because:
- Each feature touches a different cross-section of the 18+ existing files
- File rename operations (F-001) must complete before features that create new files at new paths (F-004, F-006, F-007, F-008)
- Auto-commit (F-003) should exist before versioning (F-004) since releases depend on committed history
- Reliability fixes (F-009) should land before new agent roles that depend on the coordinator loop
- One-sprint completion would require editing all 30+ files simultaneously, creating unmanageable merge conflicts in the evaluation

## High-level technical design

### File structure (after enhancement)

```
plugins/harness/
  .codex-plugin/plugin.json          (updated: name=harness, version=0.2.0)
  agents/
    initializer.md                   (modified: new paths)
    planner.md                       (modified: new paths, methodology)
    generator.md                     (modified: new paths, auto-commit)
    evaluator.md                     (modified: new paths, test verification)
    coordinator.md                   (modified: new paths, retry, context reset, enforcement)
    tester.md                        (new)
    reviewer.md                      (new)
    releaser.md                      (new)
    architect.md                     (new)
  commands/
    harness:init.md                  (renamed + modified)
    harness:run.md                   (renamed + modified)
    harness:session.md               (renamed + modified)
    harness:reset.md                 (renamed + modified)
    harness:release.md               (new)
    harness:migrate.md               (new)
  hooks/hooks.json                   (modified: new paths)
  skills/harness/
    SKILL.md                         (modified: all sections)
    roles/
      initializer.md                 (modified)
      planner.md                     (modified)
      generator.md                   (modified)
      evaluator.md                   (modified)
      coordinator.md                 (modified)
      tester.md                      (new)
      reviewer.md                    (new)
      releaser.md                    (new)
      architect.md                   (new)
    references/patterns.md           (modified: new schemas, paths, IDs)
    agents/openai.yaml               (modified)
  install.sh                         (modified)
  install.bat                        (modified)
  README.md                          (full rewrite)
```

### Runtime artifact structure (per project using the plugin)

```
.harness/
  features.json                      (was: artifacts/feature-list.json)
  state.json                         (was: artifacts/run-state.json)
  progress.md
  init.md
  init.sh
  init.bat                           (new: cross-platform)
  spec.md
  test-plan.md                       (new)
  architecture.md                    (new, optional)
  release.json                       (new)
  changelog.md                       (new)
  decomposition.md                   (optional)
  summary.md
  handoff.md                         (reset-based only)
  evaluator-calibration.md           (optional)
  cost-log.md                        (optional)
  sprints/
    NN-contract.md
    NN-contract-review.md
    NN-builder-report.md
    NN-evaluation.md
    NN-evaluation.json
    NN-evaluator-steps.md
    NN-test-report.md                (new)
    NN-review.md                     (new)
```

### Updated sprint flow

```
initializer -> planner -> [architect] -> generator -> [tester] -> [reviewer] -> evaluator -> coordinator -> [releaser]
```

Brackets indicate optional roles activated by project needs or plugin availability.

### Key schema additions

**state.json** gains:
- `methodology`: string (agile | waterfall | scrum | kanban)
- `current_sprint_phase`: string (idle | contract | implementation | testing | review | evaluation)
- `rounds_since_reset`: number
- `cost_tracking`: object with per-round timestamps
- `errors`: array of error objects

**features.json** uses `F-XXX` ID format instead of `feature-XXX`.

## Non-goals

- GUI or web dashboard for the harness
- npm packaging or registry publication
- Automated CI/CD pipeline integration
- Support for agent runtimes other than Claude Code and Codex
- Plugin marketplace submission (this is a local-install plugin)
- Backward compatibility with the old `artifacts/` layout after migration (the migrate command is the upgrade path; old format is not supported indefinitely)
- Real-time collaboration or multi-user features
- Telemetry or usage analytics

## Definition of done

All ten features pass evaluator verification. Specifically:
1. No file in the plugin references old paths (`artifacts/`, `feature-list.json`, `run-state.json`, `long-running-harness` in internal paths)
2. All new agent files, role files, and command files exist and contain correct metadata blocks
3. `install.sh` completes without errors when run from the plugin directory
4. All JSON files parse without errors
5. The README accurately documents all commands, agents, and the new artifact layout
6. Internal cross-references between Markdown files resolve to files that exist
