# Initialization Report

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, plugins/harness/skills/ directory listing, .claude-plugin/marketplace.json, .codex-plugin/plugin.json, install.sh, install.bat, README.md, release.json
- Status: accepted

## Project overview

Refactor the harness from a single-plugin monolith into a two-plugin architecture: **harness** (domain-blind core) and **harness-sdlc-suite** (software delivery domain skills). This is a v2.0.0 release -- breaking change to plugin structure.

Current state: v1.0.0 monorepo at `C:\Users\zhijie\Desktop\ai\harness`. All 5 domain skills live under `plugins/harness/skills/` alongside the core `harness/` skill.

Target state: Two plugins under `plugins/`, updated manifests, updated install scripts, updated documentation. Domain skills moved to `plugins/harness-sdlc-suite/skills/`.

## Current structure verification

### Core plugin (plugins/harness/)
- agents/: 6 agent files (coordinator, evaluator, generator, initializer, planner, releaser)
- commands/: 5 command files (init, release, reset, run, session)
- skills/harness/: Core skill with SKILL.md, 6 role files, 2 reference files
- skills/harness-sdlc/: Domain skill (to be moved)
- skills/harness-ea/: Domain skill (to be moved)
- skills/harness-ba/: Domain skill (to be moved)
- skills/harness-sa/: Domain skill (to be moved)
- skills/harness-ops/: Domain skill (to be moved)

### Manifests
- .claude-plugin/marketplace.json: Single plugin entry
- .codex-plugin/plugin.json: Single skills path (string)
- plugins/harness/.claude-plugin/plugin.json: Core plugin manifest at v1.0.0

### Install scripts
- install.sh: Copies from plugins/harness/ only
- install.bat: Copies from plugins/harness/ only

### Documentation
- README.md: Documents single-plugin architecture

## Features (7 total)

| ID | Title | Priority | Dependencies |
|----|-------|----------|-------------|
| F-001 | Create harness-sdlc-suite plugin structure | high | none |
| F-002 | Create harness-sdlc-suite index skill | high | none |
| F-003 | Make core SKILL.md domain-blind | high | F-001, F-002 |
| F-004 | Update marketplace manifest | medium | F-001 |
| F-005 | Update Codex manifest | medium | F-001 |
| F-006 | Update install scripts | medium | F-001 |
| F-007 | Update README | medium | F-001 |

## Sprint plan (4 sprints)

1. Sprint 1: F-001 + F-002 -- foundational structure and index skill
2. Sprint 2: F-003 -- surgical core SKILL.md domain-blind refactor
3. Sprint 3: F-004 + F-005 + F-006 -- manifest and script updates
4. Sprint 4: F-007 -- documentation wrap-up

## Invariants

1. No changes to agent or command file behavior -- pure structural refactor
2. Domain skill SKILL.md files must be content-identical before and after move
3. Dual-runtime compatibility (Claude Code marketplace + Codex CLI) must be maintained
4. Core SKILL.md must retain all orchestration logic (dispatch rules, execution loop, stop conditions)
5. Authenticity gate remains fully domain-agnostic

## Setup

No build step, no dev server, no dependencies. This is a pure Markdown/JSON/shell-script refactoring project. Verification is done by file existence checks, content comparison, and manual read-through.

## Smoke test

Verification that:
1. All 5 domain skills exist under plugins/harness/skills/ (pre-refactor baseline)
2. Core skill exists at plugins/harness/skills/harness/SKILL.md
3. Both manifest files exist and are valid JSON
4. install.sh and install.bat exist
5. README.md exists
