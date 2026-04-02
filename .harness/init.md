# Initialization Documentation

## Metadata
- Role: initializer
- Agent: initializer-1
- Inputs: spec.md, plugin source tree
- Status: accepted

## Project

Codex Fix + Enhancements -- a documentation/schema fix project targeting 6 Markdown files and 1 JSON schema section within the long-running-harness plugin. No application code is modified.

## Prerequisites

No build tools, package managers, or dev servers are required. This project modifies only Markdown and JSON schema files within the plugin tree.

## Verification

The init.sh script verifies that all 6 target files exist before any sprint work begins:

1. `plugins/harness/agents/evaluator.md` (F-001)
2. `plugins/harness/agents/coordinator.md` (F-004)
3. `plugins/harness/skills/harness/SKILL.md` (F-005)
4. `plugins/harness/skills/harness/references/patterns.md` (F-003)
5. `plugins/harness/skills/harness/roles/evaluator.md` (F-002)
6. `plugins/harness/skills/harness/roles/coordinator.md` (F-004)

## Sprint ordering

1. F-003 -- Schema update in patterns.md (no dependencies)
2. F-001 -- Evaluator pre-flight in agents/evaluator.md (depends on F-003)
3. F-002 -- Evaluator role mirror in roles/evaluator.md (depends on F-001)
4. F-004 -- Coordinator enforcement in agents/coordinator.md + roles/coordinator.md (depends on F-003)
5. F-005 -- SKILL.md runtime verification (depends on F-001)

## Feature verification method

All features are verified by reading file contents and grepping for key terms:
- F-003: `codex_detection` in patterns.md
- F-001: `pre-flight` or `Pre-Flight` in agents/evaluator.md
- F-002: `pre-flight` or `harness-sdlc` in roles/evaluator.md
- F-004: `contract-review.md`, `evaluation.json`, `rounds_since_reset` in agents/coordinator.md
- F-005: `runtime verification` in SKILL.md
