# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-1
- Inputs: .harness/spec.md, .harness/features.json
- Status: accepted

## Target feature IDs
- F-001

## Goal
Rewrite evaluator.md codex detection from descriptive bullets to mandatory sequential pre-flight section. Add SDLC skill reference to read list.

## Deliverables
- Modified `plugins/harness/agents/evaluator.md` with Section 0 pre-flight and harness-sdlc reference

## Contract checks
- `FN-01`: required -- Pre-Flight section exists before Testing section
- `FN-02`: required -- harness-sdlc/SKILL.md in read list
- `FN-03`: required -- Old codex detection bullets replaced
