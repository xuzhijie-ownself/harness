# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-1
- Inputs: .harness/spec.md, .harness/features.json
- Status: accepted

## Target feature IDs
- F-005

## Goal
Add Runtime Verification Requirement subsection to SKILL.md Evaluator section requiring runtime verification for software-profile projects.

## Deliverables
- Modified `plugins/harness/skills/harness/SKILL.md`

## Contract checks
- `FN-01`: required -- Runtime Verification Requirement subsection exists under Evaluator
- `FN-02`: required -- Applies to software-profile projects specifically
- `FN-03`: required -- Build-only verification explicitly marked insufficient
- `FN-04`: required -- Includes 4 runtime verification steps
