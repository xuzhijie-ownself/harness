# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-1
- Inputs: .harness/spec.md, .harness/features.json
- Status: accepted

## Target feature IDs
- F-004

## Goal
Add Codex Detection Enforcement section to coordinator.md. Expand artifact checks from 3 to 5. Add context freshness trace. Mirror in roles/coordinator.md.

## Deliverables
- Modified `plugins/harness/agents/coordinator.md`
- Modified `plugins/harness/skills/harness/roles/coordinator.md`

## Contract checks
- `FN-01`: required -- Codex Detection Enforcement section exists in coordinator.md
- `FN-02`: required -- 5 artifacts checked (including contract-review.md and builder-report.md)
- `FN-03`: required -- Context freshness trace (rounds_since_reset / threshold) in coordinator.md
- `FN-04`: required -- Codex enforcement referenced in roles/coordinator.md Focus list
