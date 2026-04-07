# Sprint Proposal

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, harness-sen/SKILL.md, harness-so/SKILL.md, harness-sales-suite/SKILL.md (index), 01-eval.json
- Status: in_review

## Target feature IDs
- F-053
- F-054
- F-055

## Grouping waiver
Two independent file audits (F-053, F-054) using the same 6-section checklist as Sprint 1, plus one integration audit (F-055) that cross-references all 5 domain skills against the index skill. F-055 depends on F-050-F-054 being complete, which they are (F-050-F-052 passed in Round 1, F-053-F-054 will be completed in this round before F-055 runs). Grouping follows the spec.md sprint plan.

## Goal
1. Audit and fix harness-sen/SKILL.md and harness-so/SKILL.md against the 6-section checklist (same fixes as Sprint 1: add Standard Contract Checks with criterion IDs, add Security Considerations subsection).
2. Integration audit: verify index skill routing table paths, criteria key mapping, verification methods, and domain skill cross-references are consistent.

## Deliverables

### F-053 and F-054: Same pattern as Sprint 1
- Add Standard Contract Checks subsection with criterion-mapped check IDs to each file
- Add Security Considerations subsection with domain-specific guidance to each file

### F-055: Integration audit
- Verify all 5 routing paths resolve to actual files
- Verify criteria key mapping in index matches Section 5 headings in each domain skill
- Verify verification methods in index match domain skill Section 3 verification approaches
- Verify plugin.json file references resolve
- Fix any inconsistencies found

## Pre-audit findings

### harness-sen/SKILL.md (F-053)
- Gap 1: No Standard Contract Checks with criterion IDs (same as Sprint 1 files)
- Gap 2: No Security Considerations subsection (same as Sprint 1 files)
- Other 4 sections pass: 5 methodologies, 4 criteria with 0-5 anchors, verification methods, 6 anti-patterns

### harness-so/SKILL.md (F-054)
- Gap 1: No Standard Contract Checks with criterion IDs (same as Sprint 1 files)
- Gap 2: No Security Considerations subsection (same as Sprint 1 files)
- Other 4 sections pass: 5 methodologies, 4 criteria with 0-5 anchors, verification methods, 6 anti-patterns

### Index skill (F-055) preliminary scan
- Domain Profiles table: 5 profiles with criteria -- need to verify criteria match Section 5 headings
- Domain Skill Routing: 5 paths -- need to verify files exist
- Criteria Key Mapping: 5 profiles x 4 criteria -- need to verify exact key matches
- Domain Verification Methods: 5 profiles -- need to verify consistency with domain skill Section 3

## Verification
- After F-053/F-054 fixes, verify all 6 sections present in each file
- For F-055: verify each routing path resolves; verify each criteria key matches domain skill Section 5 heading; verify verification methods match
- Automated: grep for section counts, check IDs, file existence

## Acceptance criteria
- Product depth: All 6 sections present in harness-sen and harness-so; index routing complete
- Functionality: Check IDs correctly mapped; all index cross-references resolve
- Visual design: Consistent structure across all 5 domain skills and index
- Code quality: No broken markdown or orphaned references in any file

## Contract checks
- `PD-01`: (required) harness-sen and harness-so each have all 6 sections with no placeholders
- `FN-01`: (required) Contract check templates include criterion-mapped check IDs in both files
- `FN-02`: (required) Index skill routing paths resolve to actual files
- `FN-03`: (required) Index criteria key mapping matches domain skill Section 5 headings exactly
- `VD-01`: (required) Structure consistent across all 5 domain skills
- `CQ-01`: (required) No broken references in index or domain skills

## Risks
- Low risk for F-053/F-054 (same pattern as successful Sprint 1)
- Low risk for F-055 (read-only audit with targeted fixes if needed)
