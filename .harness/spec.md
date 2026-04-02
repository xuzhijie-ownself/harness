# Product Spec

## Metadata
- Role: planner
- Agent: planner-1
- Inputs: user prompt, plan (floofy-scribbling-eagle.md), project file structure
- Status: accepted

## Overview

The Harness plugin provides a multi-agent orchestration framework for Claude Code and Codex. It has 5 command entry points (`/init`, `/session`, `/run`, `/reset`, `/release`) and 3 skill entry points (`harness`, `harness-sdlc`, `harness-ea`). While the agent-level orchestration (coordinator, evaluator, generator) is well-designed, the command-level guards are weak: commands assume preconditions are met, release artifacts live in the transient `.harness/` directory, the releaser never fires automatically, and state transitions are not validated.

This project adds **pre-flight/post-flight integrity guards** to every entry point so the harness self-validates at each boundary.

## Domain Profile
- Primary: software
- Secondary: (none)
- Criteria: product_depth, functionality, visual_design, code_quality
- Artifact types: Markdown command/skill specs, agent instructions, JSON schemas
- Stakeholder lens: Plugin developers, harness users (Claude Code operators)

Note: "visual_design" maps to "documentation clarity" for this project since there is no UI -- all artifacts are Markdown and JSON. Evaluators should score documentation clarity, structural consistency, and readability under the visual_design criterion.

## Design Direction

Every command and skill must enforce a **pre-flight, execute, post-flight** pattern. Changes are purely to Markdown instruction files and JSON schema examples -- no runtime code. Consistency across the 12 files is the primary quality signal.

## Shipped Scope

### F-001: Release artifacts to project root
Move `release.json` and `CHANGELOG.md` out of `.harness/` to the project root so they survive `.harness/` cleanup. Update all references in commands, agents, roles, patterns, and SKILL.md.

### F-002: /init pre-flight guard
Add re-init detection (warn if `.harness/` exists with `status: "active"`), read existing `release.json` from project root for version continuity, and verify git repo presence.

### F-003: /session post-flight release trigger + dependency resolution + handoff cleanup
After evaluation, check if all required features pass and auto-trigger the releaser. Before feature selection, resolve `depends_on` and skip blocked features. On successful completion, clean up stale handoff.md.

### F-004: /run timeout safety + release verification
Add context-window timeout handling and post-run verification that release.json exists when all features are complete.

### F-005: /reset state preservation
Ensure `.harness/` existence before handoff, never delete root-level release artifacts, update state.json to paused, verify handoff.md completeness.

### F-006: /release validation guards
Refuse release when required features still fail. Detect double-release (same feature set). Verify clean git working tree.

### F-007: State validation in all commands
Add a shared pre-flight block to all 5 commands: verify `.harness/` exists, validate state.json fields, validate features.json structure, validate config.json with defaults.

### F-008: Releaser manifest sync
Update `agents/releaser.md` to sync version into `marketplace.json`, `plugin.json` (harness), and `.codex-plugin/plugin.json` after release.

### F-009: Harness SKILL.md workflow entry section
Add a Workflow Entry section to `skills/harness/SKILL.md` with state checks, domain skill routing, and integrity invariants (ownership rules for features.json, state.json, release.json).

### F-010: harness-sdlc activation check
Add an Activation Check section to `skills/harness-sdlc/SKILL.md` verifying `domain_profile: software`, tech stack detection, and test configuration reading.

### F-011: harness-ea activation check
Add an Activation Check section to `skills/harness-ea/SKILL.md` verifying `domain_profile: architecture`, architecture deliverables, framework detection, and repository structure.

## User Stories

- As a harness user, I want `/init` to warn me when I accidentally re-initialize an active session so I do not lose work.
- As a harness user, I want release artifacts at the project root so they survive `.harness/` cleanup between development cycles.
- As a harness user, I want `/session` to auto-trigger the releaser when all features pass so I never forget to cut a release.
- As a harness user, I want `/release` to refuse when features are still failing so I never ship broken work.
- As a harness user, I want every command to validate state before proceeding so I get clear error messages instead of silent corruption.
- As a plugin developer, I want manifest versions synced on release so the plugin.json never drifts from the actual version.
- As a harness user, I want skills to check their activation conditions so the wrong domain skill never silently applies.

## Execution Strategy
- Variant: Variant A (sprinted)
- Mode: continuous
- Expected sprint count: 11 (one feature per sprint)
- Default target ordering: dependency-first, then by feature ID
  - F-001 first (release path changes are a dependency for F-002, F-003, F-004, F-005, F-006, F-008)
  - F-007 second (state validation is referenced by F-002 through F-006)
  - F-002 through F-006 in ID order (command guards, each referencing F-001 paths and F-007 validation)
  - F-008 after F-001 (releaser manifest sync depends on root paths)
  - F-009 after F-007 (SKILL.md workflow entry references state validation pattern)
  - F-010 and F-011 last (domain skill activation checks are independent)
- Ordering: F-001 -> F-007 -> F-002 -> F-003 -> F-004 -> F-005 -> F-006 -> F-008 -> F-009 -> F-010 -> F-011
- Multi-feature sprint policy: one feature per sprint by default. Grouping permitted only for F-010 + F-011 (both are small, independent activation checks with identical structure) if the coordinator judges context allows it.
- Simplification policy: features may not be simplified below what the plan specifies. Each feature is already a minimal unit. If a feature fails twice consecutively, the coordinator should inspect whether a dependency was missed rather than simplify.

## High-level Technical Design

- Frontend: N/A (no UI)
- Backend: N/A (no runtime code)
- Data/storage: Markdown instruction files (12 total), JSON schema examples in patterns.md

All changes are to Markdown files that instruct Claude Code and Codex agents. The "code" is natural language specification. Quality is measured by:
1. Completeness -- every guard described in the plan is present
2. Consistency -- path references (e.g., `release.json` at root vs `.harness/release.json`) are uniform
3. Clarity -- instructions are unambiguous and follow the pre-flight/execute/post-flight pattern

### Files to Modify

| File | Feature(s) |
|------|------------|
| `plugins/harness/commands/init.md` | F-002, F-007 |
| `plugins/harness/commands/session.md` | F-003, F-007 |
| `plugins/harness/commands/run.md` | F-004, F-007 |
| `plugins/harness/commands/reset.md` | F-005, F-007 |
| `plugins/harness/commands/release.md` | F-006, F-007 |
| `plugins/harness/agents/releaser.md` | F-001, F-008 |
| `plugins/harness/agents/coordinator.md` | F-001 |
| `plugins/harness/skills/harness/roles/releaser.md` | F-001 |
| `plugins/harness/skills/harness/references/patterns.md` | F-001 |
| `plugins/harness/skills/harness/SKILL.md` | F-001, F-009 |
| `plugins/harness/skills/harness-sdlc/SKILL.md` | F-010 |
| `plugins/harness/skills/harness-ea/SKILL.md` | F-011 |

## Non-goals

- Runtime code changes (the harness is pure Markdown instructions, not a code application)
- New commands or skills (this project hardens existing entry points, it does not add new ones)
- Automated testing infrastructure (verification is by manual grep and structural review)
- Changes to the evaluator, generator, or coordinator agent logic beyond path updates
- Version bumping the plugin itself (that is the releaser's job after this work ships)

## Definition of Done

1. All 12 files listed above are modified per the plan
2. Every command file contains a pre-flight section with state validation
3. `release.json` and `CHANGELOG.md` references point to project root (not `.harness/`) in all files
4. `grep -r '.harness/release.json' plugins/harness/` returns zero matches
5. `/release` command spec includes feature-pass and double-release guards
6. `/session` command spec includes dependency resolution and release trigger post-flight
7. All 3 SKILL.md files have entry/activation check sections
8. Manifest sync instructions are present in the releaser agent spec
