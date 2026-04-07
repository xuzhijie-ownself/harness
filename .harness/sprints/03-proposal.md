# Sprint Proposal

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, all SKILL.md files, 01-eval.json, 02-eval.json
- Status: in_review

## Target feature IDs
- F-056

## Goal
Perform adversarial review of the entire harness-sales-suite directory. Triage findings into BLOCKING/HIGH/LOW. Fix all BLOCKING and HIGH findings. Document LOW findings as non-blocking.

## Deliverables
- Adversarial review findings documented in 03-eval.md
- All BLOCKING and HIGH findings fixed in the affected files
- LOW findings documented as non-blocking issues

## Pre-review findings (from initial adversarial scan)

### BLOCKING: None found
No factual errors, no broken file references, no missing required sections.

### HIGH-001: Check ID prefix collisions across domain skills
Three pairs of check ID prefixes collide between domain skills:
1. CC-01/CC-02: harness-tm (compliance_coverage) vs harness-sen (content_coverage)
2. DC-01/DC-02: harness-se (demo_completeness) vs harness-so (data_completeness)
3. SD-01/SD-02: harness-se (solution_documentation) vs harness-so (scalability_design)

This causes ambiguity when using cross-domain composability (primary + secondary profile). Fix: rename the colliding prefixes in harness-sen and harness-so to be globally unique.

Rename plan:
- harness-sen: CC -> CT (content), leaving harness-tm's CC (compliance) unchanged
- harness-so: DC -> DT (data), leaving harness-se's DC (demo) unchanged
- harness-so: SD -> SL (scalability), leaving harness-se's SD (solution) unchanged

### LOW-001: Anti-pattern count variance
harness-sales and harness-tm have 8 anti-patterns; harness-se, harness-sen, harness-so have 6. All meet the 5+ threshold. Not a defect, but asymmetric.

### LOW-002: Index skill has no frontmatter description field "version"
Plugin.json has version "1.0.0" but the index SKILL.md frontmatter does not include a version field. Minor inconsistency.

## Verification
- After renaming, verify no colliding prefixes remain across all 5 files
- Verify renamed IDs still map correctly to their criteria
- Verify no regressions in section structure

## Acceptance criteria
- Product depth: All BLOCKING and HIGH findings fixed; adversarial review completed
- Functionality: Check IDs globally unique across all 5 domain skills
- Visual design: No formatting regressions
- Code quality: No broken references after renaming

## Contract checks
- `PD-01`: (required) Adversarial review covers all files in harness-sales-suite directory
- `FN-01`: (required) All BLOCKING findings fixed (none found)
- `FN-02`: (required) All HIGH findings fixed (check ID collisions resolved)
- `CQ-01`: (required) No regressions introduced by fixes

## Risks
- Low: renaming check IDs is a find-and-replace operation on 2 files. No cross-references in other files point to these specific IDs.
