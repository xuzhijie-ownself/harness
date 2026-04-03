# Sprint Contract

## Metadata
- Role: generator
- Agent: coordinator-as-generator
- Inputs: .harness/spec.md, .harness/features.json, SKILL.md, roles/evaluator.md
- Status: in_review

## Target feature IDs
- F-003
- F-004

## Grouping waiver
F-003 (SKILL.md trim) and F-004 (Codex detection simplify) are grouped because F-004 moves content to the same `references/advanced.md` file created by F-003. Natural co-location -- both features write to advanced.md.

## Goal
Extract non-core sections from SKILL.md to a new `references/advanced.md`. Condense the Codex detection procedure in the evaluator role file to a concise decision tree, moving the detailed procedure to advanced.md.

## Deliverables

### F-003: SKILL.md non-core section extraction
- Create new file: `plugins/harness/skills/harness/references/advanced.md`
- Move from SKILL.md to advanced.md: Harness Decay, Simplify Methodically, Review The Harness, Variant B/C full descriptions, Context Reset vs Compaction details
- Keep one-line summaries with pointer to advanced.md in SKILL.md
- Target: SKILL.md reduced by at least 60 lines from current 787 lines

### F-004: Codex detection simplification
- Condense evaluator role file's Code Review Pre-Flight from ~25 lines to ~10-line decision tree
- Move detailed Step 1-4 procedure to advanced.md
- Preserve all output fields: review_mode, config_use_codex, codex_available, detection_result, fallback_reason

## Verification

### F-003 checks
- PD-03 (required): references/advanced.md exists and contains extracted sections
- FN-03 (required): SKILL.md contains pointer to advanced.md for moved sections
- CQ-03 (required): SKILL.md line count reduced by at least 60 lines

### F-004 checks
- PD-04 (required): Codex detection in evaluator role file is 10 lines or fewer
- FN-04 (required): Same 5 output fields recorded (review_mode, config_use_codex, codex_available, detection_result, fallback_reason)
- CQ-04 (required): Detailed procedure exists in advanced.md

## Acceptance criteria
- Product depth: Non-core content cleanly extracted; codex detection is a concise decision tree
- Functionality: No behavioral change; same logic, fewer words
- Visual design: Consistent Markdown formatting in new advanced.md
- Code quality: Measurable line reduction in SKILL.md and evaluator role file

## Risks
- Must ensure advanced.md cross-references are correct
- Codex decision tree must preserve same branching logic as verbose version
