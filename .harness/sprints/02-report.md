# Builder Report

## Metadata
- Role: generator
- Agent: coordinator-generator-1
- Inputs: accepted 02-contract.md, spec.md, features.json
- Status: completed

## Target feature IDs
- F-028, F-029

## Implemented

### F-028: Standardize sprint artifact naming
- Updated patterns.md artifact layout: contract->proposal, contract-review->review, builder-report->report, evaluation->eval
- Updated all template names and headings in patterns.md
- Updated lib/artifacts.mjs validate-artifacts to check proposal.md, review.md, report.md, eval.md, eval.json
- Updated postmortem-data in harness-companion.mjs to filter for -eval.json
- Updated finalize-round to read NN-eval.json
- Updated evaluator.md, generator.md, coordinator.md, session.md, SKILL.md, postmortem.md with new names
- Updated patterns.md Review Checklist to reference proposal and eval

### F-029: Consolidate root artifacts and simplify enums
- Removed init.md, summary.md, decomposition.md from patterns.md artifact layout
- Removed decomposition.md template from patterns.md
- Changed features.json schema status from not_started/in_progress/done to pending/done
- Changed maturity from 5-level (draft/functional/reviewed/polished/accepted) to 3-level (draft/reviewed/accepted)
- Removed supervised-step mode alias from state.mjs JSDoc and patterns.md spec template
- Updated features.mjs JSDoc for new enum values
- Updated evaluator.md maturity rules (removed polished level)
- Updated SKILL.md Feature Maturity table to 3-level system
- Removed decomposition.md from coordinator.md and planner.md
- Removed summary.md from coordinator.md, releaser.md, and SKILL.md

## Self-check
- Complete: All artifact name references updated across all files
- Complete: Enum simplification applied consistently

## Authenticity self-check
- **Internal consistency**: New names (proposal, review, report, eval) used consistently across all 10+ files touched
- **Intentionality**: Each naming change follows the short-suffix pattern from the spec
- **Craft**: File formatting maintained, no orphaned whitespace
- **Fitness for purpose**: All subcommands still produce valid JSON output

## Suggested feature updates
- F-028: All verification steps should pass
- F-029: All verification steps should pass
