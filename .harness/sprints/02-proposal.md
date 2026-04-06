# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-generator-1
- Inputs: .harness/spec.md, .harness/features.json, 01-evaluation.json
- Status: accepted

## Target feature IDs
- F-028, F-029

## Grouping waiver
Both features share the same edit surfaces: patterns.md (schemas and templates), role files, and lib/artifacts.mjs. Grouping avoids two separate passes over the same files.

## Goal
Rename all sprint artifact references from verbose names to short suffixes (proposal, review, report, eval). Consolidate root artifacts by removing init.md, summary.md, decomposition.md from the layout. Simplify feature status to pending/done and maturity to draft/reviewed/accepted. Remove supervised-step mode alias.

## Deliverables

### F-028: Standardize sprint artifact naming
1. Update patterns.md artifact layout: contract->proposal, contract-review->review, builder-report->report, evaluation->eval
2. Update all template names in patterns.md
3. Update lib/artifacts.mjs validate-artifacts to check new filenames
4. Update postmortem-data to read NN-eval.json
5. Update finalize-round to read NN-eval.json
6. Update role files: evaluator.md, generator.md, coordinator.md, session.md, SKILL.md

### F-029: Consolidate root artifacts and simplify enums
1. Remove init.md, summary.md, decomposition.md from patterns.md artifact layout
2. Remove decomposition.md template from patterns.md
3. Simplify features.json schema: status to pending/done, maturity to draft/reviewed/accepted
4. Remove supervised-step from spec.md template mode options
5. Update SKILL.md references

## Contract checks
- `PD-01` (required): All artifact references use new names (proposal, review, report, eval)
- `FN-01` (required): validate-artifacts checks new filenames; postmortem-data and finalize-round read NN-eval.json
- `VD-01` (required): No init.md, summary.md, decomposition.md in artifact layout; decomposition.md template removed
- `CQ-01` (required): features.json schema uses pending/done and draft/reviewed/accepted; no supervised-step
