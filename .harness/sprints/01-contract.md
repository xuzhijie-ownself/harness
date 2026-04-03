# Sprint Contract

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, progress.md
- Status: in_review

## Target feature IDs
- F-001

## Goal
Rename the Authenticity Gate dimension `coherence` to `internal_consistency` across all 6 base framework files and remove 3 disambiguation notes that are no longer needed after the rename. This is a text-only change with no logic modifications.

## Deliverables

Six files edited:

1. `plugins/harness/skills/harness/SKILL.md` -- rename dimension in table, remove disambiguation note from definition
2. `plugins/harness/skills/harness/references/patterns.md` -- rename JSON key in authenticity_gate schema, rename display label in builder-report template
3. `plugins/harness/agents/generator.md` -- rename checklist item label
4. `plugins/harness/skills/harness/roles/generator.md` -- rename bullet label
5. `plugins/harness/agents/evaluator.md` -- rename dimension in verification table, remove disambiguation note
6. `plugins/harness/skills/harness/roles/evaluator.md` -- rename dimension in list, remove disambiguation instruction

## Verification

- `grep -r "coherence" <all 6 files>` returns zero matches in Authenticity Gate dimension-name contexts
- `grep -r "internal_consistency" <all 6 files>` confirms the new name appears in all expected locations
- `grep -r "Internal consistency" <all 6 files>` confirms display labels use sentence case
- Dimension definitions remain unchanged (only the name changes)
- No files outside the 6 listed have been modified

## Acceptance criteria

- Product depth: All 6 files updated atomically with correct naming convention (snake_case for keys, sentence case for labels)
- Functionality: The rename is complete -- no remaining `coherence` references in dimension-name contexts
- Visual design: N/A for this change (markdown formatting preserved)
- Code quality: Clean edits with no unintended side effects; disambiguation notes fully removed

## Contract checks

- `PD-01` (required): All 6 files contain `internal_consistency` or `Internal consistency` where `coherence`/`Coherence` previously appeared as a dimension name
- `FN-01` (required): `grep -r "coherence" <6 files>` returns zero hits in dimension-name contexts
- `FN-02` (required): 3 disambiguation notes removed (SKILL.md, evaluator.md, roles/evaluator.md)
- `CQ-01` (required): No files outside the 6 listed were modified; no domain skill files touched

## Risks

- Accidentally replacing `coherence` in prose contexts where it is not a dimension name (mitigated: no such prose references exist in these files based on review)
- Missing one of the 3 disambiguation notes (mitigated: spec lists exact locations)
