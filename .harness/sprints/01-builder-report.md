# Builder Report

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: accepted contract, spec.md, features.json
- Status: completed

## Target feature IDs
- F-001

## Implemented

All 6 files edited as specified:

1. **SKILL.md** (line 372): Renamed `**coherence**` to `**internal_consistency**` in the Dimensions table. Removed the disambiguation note from the definition, keeping only the core definition text.

2. **patterns.md** (line 258): Renamed JSON key `"coherence"` to `"internal_consistency"` in the authenticity_gate schema. (line 441): Renamed `**Coherence**` to `**Internal consistency**` in the builder-report template.

3. **agents/generator.md** (line 33): Renamed `**Coherence**` to `**Internal consistency**` in the Pre-Implementation Checklist.

4. **roles/generator.md** (line 45): Renamed `**Coherence**` to `**Internal consistency**` in the Authenticity bullet list.

5. **agents/evaluator.md** (line 94): Renamed `**coherence**` to `**internal_consistency**` in the verification table. Removed the disambiguation note at the former line 104.

6. **roles/evaluator.md** (line 83): Renamed `coherence` to `internal_consistency` in the dimension list. Removed the disambiguation instruction at the former line 89.

## Commands run
- `grep -n "coherence" <6 files>` -- confirmed zero hits in Authenticity Gate dimension-name contexts (remaining hits are domain criteria in architecture/solution_architecture profiles and general prose, which are out of scope)
- `grep -n "internal_consistency\|Internal consistency" <6 files>` -- confirmed new name present in all 7 expected locations across 6 files

## Self-check
- All 6 files updated with correct naming conventions
- No files outside the 6 listed were modified
- No domain skill files touched
- Definitions unchanged -- only names renamed

## Authenticity self-check
- **Internal consistency**: All edits follow the same convention: snake_case (`internal_consistency`) for JSON keys and technical references, sentence case (`Internal consistency`) for display labels. Applied consistently across all 6 files.
- **Intentionality**: Each edit was targeted to the specific location identified in the spec. No blanket find-replace was used; each file was reviewed individually to ensure only Authenticity Gate dimension-name contexts were modified while domain criterion references were preserved.
- **Craft**: Markdown table formatting preserved. JSON indentation preserved. Line spacing around removed disambiguation notes is clean (no double blank lines introduced).
- **Fitness for purpose**: The rename is immediately consumable by generator and evaluator agents. The new name `internal_consistency` is unambiguous and does not overlap with any domain criterion name.

## Suggested feature updates
- F-001: should now pass. All 6 files renamed, all 3 disambiguation notes removed, grep verification confirms zero dimension-name hits for "coherence."
