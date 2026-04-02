# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-1
- Inputs: .harness/spec.md, .harness/features.json
- Status: accepted

## Target feature IDs
- F-003

## Goal
Add `codex_detection` object to `review_findings` in the `NN-evaluation.json` schema in `patterns.md`. Update the `NN-evaluation.md` template's Code Review section to include detection fields.

## Deliverables
- Modified `plugins/harness/skills/harness/references/patterns.md` with updated JSON schema and Markdown template

## Verification
- Grep for `codex_detection` in patterns.md
- Verify `config_use_codex`, `settings_codex_enabled`, `detection_result`, `fallback_reason` fields exist
- Verify NN-evaluation.md template Code Review section includes detection fields

## Contract checks
- `FN-01`: required -- codex_detection object exists in review_findings JSON schema
- `FN-02`: required -- NN-evaluation.md template Code Review section has detection fields
