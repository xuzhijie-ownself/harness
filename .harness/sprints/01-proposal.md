# Sprint Proposal

## Metadata
- Role: generator
- Agent: generator-1
- Inputs: .harness/spec.md, .harness/features.json, harness-sales/SKILL.md, harness-tm/SKILL.md, harness-se/SKILL.md
- Status: in_review

## Target feature IDs
- F-050
- F-051
- F-052

## Grouping waiver
Three independent file audits using the same 6-section checklist. No cross-dependencies. Grouping avoids 2 unnecessary round-trips while keeping scope reviewable (3 files, same audit pattern). This follows the sprint plan defined in spec.md.

## Goal
Audit harness-sales/SKILL.md, harness-tm/SKILL.md, and harness-se/SKILL.md against the 6-section checklist. Fix any structural gaps found. Ensure all 3 files meet the quality standard for downstream evaluation use.

## Deliverables
For each of the 3 SKILL.md files:
- Verified 6-section structure
- Fixed contract check templates to include check IDs with criterion prefix patterns
- Added dedicated Security Considerations subsection if missing
- Ensured all criteria anchors are concrete and domain-specific

## Findings from pre-audit

### Gap 1: Missing Check IDs in Contract Check Templates (all 3 files)
The spec requires "at least 4 contract checks (one per criterion) with check IDs matching the criterion prefix pattern." Currently, all 3 files use plain bullet checklists grouped by deliverable type, but they lack structured check IDs (e.g., QD-01 for qualification_depth, PC-01 for pipeline_coverage). Fix: Add a "Standard Contract Checks" subsection to Section 6 with criterion-mapped check IDs.

### Gap 2: Security Guidance Not a Distinct Section (all 3 files)
The spec requires "domain-specific security considerations covering data sensitivity, access control, and confidentiality." Currently, security items are embedded within individual checklists but there is no consolidated Security Considerations subsection. Fix: Add a "Security Considerations" subsection to Section 6 after Anti-Patterns with domain-specific guidance.

### No other gaps found
- Methodology tables: 5+ methodologies per file (checklist requires 3+). Pass.
- Criteria anchors: All 4 criteria have 0-5 with concrete, domain-specific descriptions. Pass.
- Verification methods: Domain-specific with what-to-check and how. Pass.
- Anti-patterns: 6-8 per file with detection signals and penalties. Pass.

## Verification
- After fixing, re-read each file and verify all 6 sections present
- Verify check IDs follow criterion prefix pattern
- Verify Security Considerations subsection is domain-specific (not generic boilerplate)
- Verify no existing content was accidentally removed

## Acceptance criteria
- Product depth: All 6 sections present and complete in each file; audit methodology applied consistently
- Functionality: Check IDs resolve to the correct criteria; security guidance covers the domain's specific concerns
- Visual design: Consistent structure across all 3 files; tables properly formatted
- Code quality: No broken markdown; no orphaned references; no duplicate content

## Contract checks
- `PD-01`: (required) Each SKILL.md has all 6 sections with no placeholders or TBDs
- `FN-01`: (required) Contract check templates include at least 4 criterion-mapped check IDs per file
- `VD-01`: (required) Section structure is consistent across all 3 files
- `CQ-01`: (required) No broken markdown formatting, orphaned cross-references, or duplicate sections

## Risks
- Minimal: these are markdown file edits with well-defined structural requirements. Risk of over-editing existing content that is already good. Mitigation: only add missing sections, do not rewrite existing content.
